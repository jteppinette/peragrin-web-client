<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item to="/organizations">Organizations</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled>{{ organization.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap>
    <v-flex xs12>

    <v-card v-if="initialized">
      <v-card-title primary-title class="primary headline">{{ organization.name }}</v-card-title>
      <v-card-text class="secondary" style="position: relative">
        <v-chip v-if="organization.category" outline class="ma-0 white--text">{{ organization.category }}</v-chip>
        <v-btn v-if="isAdministrator" @click.stop="dialogs.organizationsCreateUpdate = !dialogs.organizationsCreateUpdate" fab right bottom absolute><v-icon>edit</v-icon></v-btn>
        <organizations-create-update v-model="dialogs.organizationsCreateUpdate" v-if="organization.id" :organization="organization" @updated="o => organization = o"></organizations-create-update>
      </v-card-text>

      <v-layout row wrap class="general">

        <!-- DETAILS -->
        <v-flex xs12 md6 class="pr-0-lg">
          <organizations-details :organization="organization"></organizations-details>
        </v-flex>

        <!-- MAP -->
        <v-flex xs12 md6 class="pl-0-lg">
          <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
            <v-marker :icon="icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}"></v-marker>
          </v-map>
        </v-flex>

      </v-layout>

    </v-card>
    </v-flex>
  </v-layout>

  <!-- PROMOTIONS -->
  <v-layout row wrap v-if="organization && communities">
    <v-flex xs12>
      <v-card>
        <v-card-title class="primary title">Promotions</v-card-title>
        <promotions-list :organizationID="id" :communities="communities"></promotions-list>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap>

    <!-- COMMUNITIES -->
    <v-flex xs12 sm6 md4 v-if="initialized">
      <v-card>
        <v-card-title class="primary title">Communities</v-card-title>
        <organization-communities-list :organizationID="id" :communities="communities" :is-administrator="isAdministrator" @added="initialize" @removed="initialize"></organization-communities-list>
      </v-card>
    </v-flex>

    <!-- OPERATORS -->
    <v-flex xs12 sm6 md4 v-if="initialized">
      <v-card>
        <v-card-title class="primary" style="position: relative">
          <span class="title">Operators</span>
          <v-btn v-if="isAdministrator" fab absolute right bottom @click.stop="dialogs.operatorsAdd = !dialogs.operatorsAdd"><v-icon>add</v-icon></v-btn>
          <organizations-operators-add v-model="dialogs.operatorsAdd" :organization="organization" @success="initializeOperators"></organizations-operators-add>
        </v-card-title>
        <v-card-text class="secondary" v-if="organization.accounts && organization.accounts.length">The following list of accounts has management access over this organization and any community that this organization manages.</v-card-text>
        <v-card-text class="secondary" v-if="organization.accounts && !organization.accounts.length">Only a managing community operator is managing this organization.</v-card-text>
        <v-list v-if="organization.accounts && organization.accounts.length" two-line>
          <v-list-tile v-for="account in organization.accounts" :key="account.id" v-if="account">
            <v-list-tile-content>
              <v-list-tile-title>{{ account.email }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ account.firstName }} {{ account.lastName }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="isAdministrator">
              <v-btn icon class="secondary" @click.stop.prevent="dialogs.operatorsRemove[account.id] = true"><v-icon class="white--text">remove</v-icon></v-btn>
            </v-list-tile-action>
            <confirm-dialog v-model="dialogs.operatorsRemove[account.id]" @confirmed="removeOperator(account.id)">Are you sure you want to remove this account, {{ account.email }}, from the {{ organization.name }} organization?</confirm-dialog>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>

    <!-- LOGO -->
    <v-flex xs12 sm6 md4 v-if="initialized">
      <v-card img>
        <v-card-title class="primary" style="position: relative">
          <span class="title">Logo</span>
          <v-dialog v-if="isAdministrator" v-model="dialogs.uploadLogo" width="800px" scrollable persistent>
            <v-btn fab absolute right bottom slot="activator"><v-icon>file_upload</v-icon></v-btn>
            <v-card>
              <v-card-title class="primary title">Upload Logo</v-card-title>
              <v-card-text>
                <p>All images will be sized to a maxium size of 130px in width and 400px in height. The provided image's aspect ratio will be maintained.</p>
                <dropzone id="myVueDropzone" param-name="logo" :url="`/organizations/${id}/logo`" :headers="{'Authorization': `Bearer ${account.token}`}" @vdropzone-success="uploadLogoSuccess" :resize-width="400" resize-method="crop" :resize-height="130" :thumbnail-width="400" :thumbnail-height="130" :max-number-of-files="1" :max-file-size-in-m-b="100"><input type="hidden"></dropzone>
              </v-card-text>
              <v-card-actions class="secondary">
                <v-spacer></v-spacer>
                <v-btn flat class="white--text" @click="dialogs.uploadLogo = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        </v-card-text>
        <v-card-media :src="organization.logoURL" height="130px" width="100%"></v-card-media>
      </v-card>
    </v-flex>

  </v-layout>

</v-container>
</template>

<script>
import promotionsList from 'common/promotions/list';
import organizationCommunitiesList from 'common/organizations/communities/list';
import organizationsDetails from 'common/organizations/details';
import organizationsCreateUpdate from 'common/organizations/create-update';
import organizationsOperatorsAdd from 'common/organizations/operators/add';
import {MARKERS} from 'common/categories';
import Dropzone from 'vue2-dropzone';
import confirmDialog from 'common/confirm-dialog';

let dialogs = {
  organizationsCreateUpdate: false,
  uploadLogo: false,
  operatorsAdd: false,
  operatorsRemove: {}
};

export default {
  props: ['id'],
  data: () => ({initialized: false, organization: {}, communities: [], dialogs}),
  computed: {
    isAdministrator () {
      let isSuper = this.$store.state.account.isSuper;
      let isOwner = this.$store.state.organizations.indexOf(Number(this.id)) >= 0;
      let isAdministrator = this.communities.some(c => this.$store.state.communities.indexOf(c.id) >= 0);
      return isSuper || isOwner || isAdministrator;
    },
    account () {
      return this.$store.state.account;
    },
    icon () {
      return this.organization.category ? MARKERS[this.organization.category] : undefined;
    }
  },
  components: {confirmDialog, promotionsList, organizationCommunitiesList, organizationsDetails, organizationsCreateUpdate, organizationsOperatorsAdd, Dropzone},
  mounted: initialize,
  methods: {removeOperator, uploadLogoSuccess, initialize, initializeOperators, initializeOrganization, initializeCommunities}
};

function initialize() {
  return Promise.all([
    this.initializeOperators(),
    this.initializeOrganization(),
    this.initializeCommunities()
  ]).then(() => this.initialized = true);
}

function removeOperator(id) {
  return this.$http.delete(`/organizations/${this.id}/accounts/${id}`)
    .then(this.initializeOperators);
}

function uploadLogoSuccess(file, {logo, logoURL}) {
  this.$set(this.organization, 'logo', logo);
  this.$set(this.organization, 'logoURL', logoURL);
  this.dialogs.uploadLogo = false;
}

function initializeOrganization() {
  return this.$http.get(`/organizations/${this.id}`)
    .then(({data: organization}) => this.organization = {...this.organization, ...organization});
}

function initializeCommunities() {
  return this.$http.get(`/organizations/${this.id}/communities`)
    .then(({data: communities}) => this.communities = communities);
}

function initializeOperators() {
  this.$http.get(`/organizations/${this.id}/accounts`)
    .then(({data: accounts}) => this.$set(this.organization, 'accounts', accounts))
    .then(() => this.dialogs.operatorsRemove = this.organization.accounts.reduce((obj, operator) => {
      obj = {...obj, [operator.id]: false};
      return obj;
    }, {}));
}
</script>

<style scoped lang="stylus">
@import '../../../settings';

.leaflet-container {
  height: 360px;

  @media screen and (max-width: $grid-breakpoints.md) {
    height: 100px;
  }
}
</style>
