<template>
<div class="overview">

  <v-row>
    <v-col xs12>
      <setup></setup>
    </v-col>
  </v-row>

  <v-row v-if="organization">
    <v-col xs12 lg6>
      <v-card class="elevation-3">
        <v-card-title class="primary white--text">Organizations</v-card-title>
        <organizations :communityID="organization.communityID"></organizations>
      </v-card>
    </v-col>
    <v-col xs12 lg6 class="map">
      <v-card v-if="organization" class="elevation-3">
        <v-card-title class="primary white--text">Map</v-card-title>
        <organization-map :organization="organization"></organization-map>
      </v-card>
    </v-col>
  </v-row>

</div>
</template>

<script>
import organizations from './organizations';
import organizationMap from './organization-map';
import setup from './setup';

export default {
  data: () => ({organization: undefined}),
  mounted,
  components: {
    organizations,
    organizationMap,
    setup
  }
};

function mounted() {
  if (sessionStorage.organizationID) {
    this.$http.get(`/organizations/${sessionStorage.organizationID}`)
      .then(response => response.json())
      .then((organization) => this.organization = organization);
  }
}
</script>
