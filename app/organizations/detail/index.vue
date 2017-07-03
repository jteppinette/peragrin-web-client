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
import {MARKERS} from 'common/categories';

export default {
  props: ['id'],
  data: () => ({organization: {}}),
  components: {promotionsList, organizationDetails},
  mounted () {
    this.$store.dispatch('initialize');
    this.$http.get(`/organizations/${this.id}`)
      .then(response => response.json())
      .then(organization => this.organization = {...this.organization, ...organization, icon: MARKERS[organization.category]});
    this.$http.get(`/organizations/${this.id}/hours`)
      .then(response => response.json())
      .then(hours => this.$set(this.organization, 'hours', hours));
    this.$http.get(`/organizations/${this.id}/communities`)
      .then(response => response.json())
      .then(communities => this.$set(this.organization, 'communities', communities));
    this.$http.get(`/organizations/${this.id}/accounts`)
      .then(response => response.json())
      .then(accounts => this.$set(this.organization, 'accounts', accounts));
  }
};
</script>

<style scoped lang="stylus">
@import '../../../settings';

.leaflet-container {
  height: 380px;

  @media screen and (max-width: $grid-breakpoints.md) {
    height: 100px;
  }
}
</style>
