<template>
<v-container class="organization-detail">

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

    <organization-create-update v-if="organization.id && isOwnerOrAdministrator()" :organization="organization" @updated="o => organization = o"></organization-create-update>

    <v-layout row wrap class="general">

      <v-flex xs12 md6 class="pr-0">
        <organization-details :organization="organization"></organization-details>
      </v-flex>

      <v-flex xs12 md6>
        <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :icon="icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}"></v-marker>
        </v-map>
      </v-flex>

    </v-layout>

  </v-card>

  <v-layout row wrap if="organization" class="middle">

    <v-flex xs12 sm6 md4>
      <v-card>
        <v-card-title class="primary">Communities</v-card-title>
        <v-list two-line class="card-body">
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

    <v-flex xs12 sm6 md4>
      <v-card>
        <v-card-title class="primary">Operators</v-card-title>
        <v-list two-line class="card-body">
          <v-list-item v-for="account in organization.accounts" :key="account.id" v-if="account">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ account.email }}</a></v-list-tile-title>
                <v-list-tile-sub-title><!-- TODO: ACCOUNT META DATA --></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-card>
    </v-flex>

    <v-flex xs12 sm6 md4>
      <v-card class="upload-logo">
        <v-card-title class="primary">Logo</v-card-title>
        <v-dialog v-model="uploadLogoDialog" width="800px" scrollable persistent>
          <v-btn floating slot="activator" class="white"><v-icon dark>file_upload</v-icon></v-btn>
          <v-card>
            <v-card-row><v-card-title class="primary">Upload Logo</v-card-title></v-card-row>
            <v-card-row>
              <v-card-text>
                <v-subheader>All images will be sized to a maxium size of 130px in width and 400px in height. The provided image's aspect ratio will be maintained.</v-subheader>
                <dropzone id="myVueDropzone" param-name="logo" :url="`/organizations/${id}/logo`" :headers="{'Authorization': `Bearer ${token}`}" @vdropzone-success="uploadLogoSuccess" :resize-width="400" resize-method="crop" :resize-height="130" :thumbnail-width="400" :thumbnail-height="130" :max-number-of-files="1" :max-file-size-in-m-b="100"><input type="hidden"></dropzone>
                <div class="right"><v-btn flat @click.native="uploadLogoDialog = false">Close</v-btn></div>
              </v-card-text>
            </v-card-row>
          </v-card>
        </v-dialog>
        <v-card-row :img="organization.logoURL" height="130px" width="100%" class="card-body"></v-card-row>
      </v-card>
    </v-flex>

  </v-layout>

  <v-layout row wrap v-if="organization && organization.communities">
    <v-flex xs12>
      <v-card>
        <v-card-title class="primary">Promotions</v-card-title>
        <promotions-list :organizationID="id" :communities="organization.communities"></promotions-list>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import promotionsList from 'common/promotions/list';
import organizationDetails from 'common/organization/details';
import organizationCreateUpdate from 'common/organization/create-update';
import {MARKERS} from 'common/categories';
import Dropzone from 'vue2-dropzone';

export default {
  props: ['id'],
  data: () => ({organization: {}, token: sessionStorage.token, uploadLogoDialog: false}),
  computed: {
    account () {
      return this.$store.state.account;
    },
    icon () {
      return this.organization.category ? MARKERS[this.organization.category] : undefined;
    }
  },
  components: {promotionsList, organizationDetails, organizationCreateUpdate, Dropzone},
  mounted () {
    this.$store.dispatch('initialize');
    this.$http.get(`/organizations/${this.id}`)
      .then(response => response.json())
      .then(organization => this.organization = {...this.organization, ...organization});
    this.$http.get(`/organizations/${this.id}/communities`)
      .then(response => response.json())
      .then(communities => this.$set(this.organization, 'communities', communities));
    this.$http.get(`/organizations/${this.id}/accounts`)
      .then(response => response.json())
      .then(accounts => this.$set(this.organization, 'accounts', accounts));
  },
  methods: {isOwnerOrAdministrator, uploadLogoSuccess}
};

function uploadLogoSuccess(file, {logo, logoURL}) {
  this.$set(this.organization, 'logo', logo);
  this.$set(this.organization, 'logoURL', logoURL);
  this.uploadLogoDialog = false;
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
</style>

<style lang="stylus">
.organization-detail {
  .btn.btn--floating {
    position: absolute;
    top: 95px;
    right: 15px;
  }

  .upload-logo .btn.btn--floating {
    position: absolute;
    top: 35px;
    right: 15px;
  }

  .dialog__container {
    display: block;
  }

  .middle .card-body {
    min-height: 130px;
  }
}
</style>
