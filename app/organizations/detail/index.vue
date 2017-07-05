<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item router to="/organizations">Organizations</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled>{{ organization.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-card class="elevation-2 mb-3">
    <v-card-row class="primary">
      <v-card-title class="white--text">{{ organization.name }}</v-card-title>
    </v-card-row>
    <v-card-row class="primary" v-if="organization.category">
      <v-card-text class="category-chip"><v-chip outline class="white--text">{{ organization.category }}</v-chip></v-card-text>
    </v-card-row>

    <v-dialog v-if="isOwnerOrAdministrator()" v-model="dialog" width="800px" scrollable persistent>
      <v-btn floating slot="activator" class="white"><v-icon dark>edit</v-icon></v-btn>
      <v-card>
        <v-card-title class="primary">Update Organization</v-card-title>
        <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
        <v-card-row>
          <v-card-text>
            <form @submit.prevent="update" novalidate>
              <organization-form v-model="data"></organization-form>
              <organization-hours v-model="data.hours"></organization-hours>

              <div class="right">
                <v-btn flat @click.native="dialog = false">Close</v-btn>
                <v-btn primary type="submit" class="white--text">Update Organization</v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card-row>
      </v-card>
    </v-dialog>

    <v-layout row wrap class="general">

      <v-flex xs12 md6 class="pr-0">
        <organization-details :organization="organization"></organization-details>
      </v-flex>

      <v-flex xs12 md6>
        <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :icon="organization.icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}"></v-marker>
        </v-map>
      </v-flex>

    </v-layout>

  </v-card>

  <v-layout row wrap v-if="organization && organization.communities">

    <v-flex xs12 md6>
      <v-card>
        <v-card-title class="primary">Promotions</v-card-title>
        <promotions-list :organizationID="id" :communities="organization.communities"></promotions-list>
      </v-card>
    </v-flex>

    <v-flex xs6 md3>
      <v-card>
        <v-card-title class="primary">Communities</v-card-title>
        <v-list two-line>
          <v-list-item v-for="community in organization.communities" :key="community.id" v-if="community">
            <v-list-tile router :to="`/communities/${community.id}`">
              <v-list-tile-content>
                <v-list-tile-title>{{ community.name }}</a></v-list-tile-title>
                <v-list-tile-sub-title v-if="community.isAdministrator">Administrator</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-card>
    </v-flex>

    <v-flex xs6 md3>
      <v-card>
        <v-card-title class="primary">Operators</v-card-title>
        <v-list>
          <v-list-item v-for="account in organization.accounts" :key="account.id" v-if="account">
            <v-list-tile>
              <v-list-tile-content><v-list-tile-title>{{ account.email }}</a></v-list-tile-title></v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-card>
    </v-flex>

  </v-layout>

</v-container>
</template>

<script>
import promotionsList from 'common/promotions/list';
import organizationDetails from 'common/organization/details';
import organizationForm from 'common/organization/form';
import organizationHours from 'common/organization/hours';
import {MARKERS} from 'common/categories';

export default {
  props: ['id'],
  data: () => ({organization: {}, data: {}, msg: '', error: false, dialog: false}),
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  components: {promotionsList, organizationDetails, organizationForm, organizationHours},
  mounted () {
    this.$store.dispatch('initialize');
    this.$http.get(`/organizations/${this.id}`)
      .then(response => response.json())
      .then(organization => this.organization = {...this.organization, ...organization, icon: MARKERS[organization.category]})
      .then(organization => this.data = JSON.parse(JSON.stringify(organization)));
    this.$http.get(`/organizations/${this.id}/communities`)
      .then(response => response.json())
      .then(communities => this.$set(this.organization, 'communities', communities));
    this.$http.get(`/organizations/${this.id}/accounts`)
      .then(response => response.json())
      .then(accounts => this.$set(this.organization, 'accounts', accounts));
  },
  methods: {update, isOwnerOrAdministrator}
};

function update() {
  return this.$http.post(`/organizations/${this.id}`, this.data)
    .then(response => response.json())
    .then(organization => this.organization = {...this.organization, ...organization, icon: MARKERS[organization.category]})
    .then(organization => this.data = JSON.parse(JSON.stringify(organization)))
    .then(() => this.dialog = false)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function isOwnerOrAdministrator() {
  if (!this.account || !this.account.organizations) return false;
  let isOwner = this.account.organizations.find(v => v.id == this.id);
  let isAdministrator = this.organization.communities ? this.account.organizations.find(v => {
    if (!v.communities) return false;
    let community = v.communities.find(c => {
      return this.organization.communities.find(u => u.id == c.id);
    });
    return community.isAdministrator;
  }) : false;
  return isOwner || isAdministrator;
}
</script>

<style scoped lang="stylus">
@import '../../../settings';

.leaflet-container {
  height: 380px;

  @media screen and (max-width: $grid-breakpoints.md) {
    height: 100px;
  }
}

.btn.btn--floating {
  position: absolute;
  top: 95px;
  right: 15px;
}

.dialog__container {
  display: block;
}

.dialog .card__text {
  max-height: 80vh;
}
</style>
