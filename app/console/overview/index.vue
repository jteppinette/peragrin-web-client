<template>
<v-layout row wrap>

  <v-flex xs12 lg8>
    <v-card v-if="community">
      <v-card-title class="primary">{{ community.name }}</v-card-title>
      <community-organizations-list :id="community.id"></community-organizations-list>
    </v-card>
    <v-card v-if="organization">
      <v-card-title class="primary">Promotions</v-card-title>
      <promotions-list :organizationID="organization.id"></promotions-list>
    </v-card>
  </v-flex>

  <v-flex xs12 lg4 v-if="organization">
    <organization-card @community:selected="assumeCommunity" :organization="organization" :hours="hours" :communities="communities" class="elevation-1"></organization-card>
  </v-flex>

</v-layout>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import organizationCard from 'common/organization/card';
import promotionsList from 'common/promotions/list';

export default {
  data: () => ({organization: undefined, hours: [], organizations: [], community: undefined, communities: []}),
  mounted,
  components: {
    communityOrganizationsList,
    organizationCard,
    promotionsList
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
  this.organization = organizations[0]
  this.$http.get(`/organizations/${this.organization.id}/hours`)
    .then(response => response.json())
    .then(hours => this.hours = hours);
  this.$http.get(`/organizations/${this.organization.id}/promotions`)
    .then(response => response.json())
    .then(promotions => this.promotions = promotions);
  return this.organization;
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
