<template>
<div class="overview">

  <v-row>
    <v-col xs12 lg8 v-if="community">
      <v-card>
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :id="community.id"></community-organizations-list>
      </v-card>
    </v-col>
    <v-col xs12 lg4 v-if="organization">
      <organization-card @community:selected="assumeCommunity" :organization="organization" :communities="communities"></organization-card>
    </v-col>
  </v-row>

</div>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import organizationCard from 'common/organization/card';

export default {
  data: () => ({organization: undefined, organizations: [], community: undefined, communities: []}),
  mounted,
  components: {
    communityOrganizationsList,
    organizationCard
  },
  methods: {
    assumeCommunity
  }
};

function mounted() {
  return initOrganizations.call(this)
    .then(assumeOrganization)
    .then(initCommunities)
    .then(communities => this.assumeCommunity(communities[0]));
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

function assumeCommunity(community) {
    return this.community = community;
}
</script>
