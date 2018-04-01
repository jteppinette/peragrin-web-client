<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Organizations</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap v-if="account && organizations">
    <v-flex xs12 md6 lg4 v-for="organization in organizations" v-if="organization" :key="organization.id">

      <v-card>
        <v-card-title primary-title class="primary headline">{{ organization.name }}</v-card-title>
        <v-card-text class="secondary"><v-chip v-if="organization.category" outline class="ma-0 white--text">{{ organization.category }}</v-chip></v-card-text>
        <organizations-details :organization="organization"></organizations-details>
        <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer :url="URL"></v-tilelayer>
          <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :icon="organization.icon"></v-marker>
        </v-map>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn flat class="white--text" :to="`/organizations/${organization.id}`">Manage</v-btn>
        </v-card-actions>
      </v-card>

    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import organizationsDetails from 'common/organizations/details';
import {MARKERS} from 'common/categories';
import {URL} from 'common/map';

export default {
  data: () => ({organizations: [], URL}),
  components: {organizationsDetails},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  mounted: initialize,
  methods: {initializeOrganizations}
};

function initialize() {
  return this.initializeOrganizations();
}

function initializeOrganizations() {
  return this.$http.get(`/accounts/${this.account.id}/organizations`)
    .then(({data: organizations}) => organizations.map(o => ({...o, icon: MARKERS[o.category]})))
    .then(organizations => this.organizations = organizations);
}
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 100px;
}
</style>
