<template>
<div class="overview">

  <v-row>
    <v-col xs12 lg6 v-if="community">
      <v-card class="elevation-3">
        <v-card-title class="primary white--text">{{ community.name }}</v-card-title>
        <community :id="community.id"></community>
      </v-card>
    </v-col>
    <v-col xs12 lg6 v-if="organization" class="map">
      <v-card v-if="organization" class="elevation-3">
        <v-card-title class="primary white--text">{{ organization.name }}</v-card-title>
        <organization-map :organization="organization"></organization-map>
      </v-card>
    </v-col>
  </v-row>

</div>
</template>

<script>
import community from './community';
import organizationMap from './organization-map';

export default {
  data: () => ({organization: undefined, organizations: [], community: undefined, communities: []}),
  mounted,
  components: {
    community,
    organizationMap
  }
};

function mounted() {
  return initOrganizations.call(this)
    .then(assumeOrganization)
    .then(initCommunities)
    .then(assumeCommunity);
}

function initOrganizations() {
  return this.$http.get('/auth/organizations')
    .then(response => response.json())
    .then((organizations) => this.organizations = organizations);
}

function assumeOrganization(organizations) {
    return this.organization = organizations[0];
}

function initCommunities(organization) {
  return this.$http.get(`/organizations/${organization.id}/communities`)
    .then(response => response.json())
    .then((communities) => this.communities = communities);
}

function assumeCommunity(communities) {
    return this.community = communities[0];
}
</script>
