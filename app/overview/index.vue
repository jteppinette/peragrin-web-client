<template>
<v-container fluid class="pa-3">
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
      <organization-card @community:selected="(community) => community = community" :organization="organization" :hours="hours" :communities="communities" class="elevation-1"></organization-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import organizationCard from 'common/organization/card';
import promotionsList from 'common/promotions/list';

export default {
  data: () => ({organization: undefined, hours: [], community: undefined, communities: []}),
  components: {
    communityOrganizationsList,
    organizationCard,
    promotionsList
  },
  computed: {
    organizations () {
      return this.$store.state.account.organizations;
    }
  },
  methods: {assumeOrganization},
  watch: {
    organizations (v) {
      if (!v || !v.length) return;
      return this.assumeOrganization(v[0])
    }
  },
  mounted () {
    if (!this.organizations || !this.organizations.length) return;
    return this.assumeOrganization(this.organizations[0])
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function assumeOrganization(organization) {
  this.organization = organization;
  initializeHours.call(this);
  initializeCommunities.call(this);
}

function initializeHours() {
  return this.$http.get(`/organizations/${this.organization.id}/hours`)
    .then(response => response.json())
    .then(hours => this.hours = hours);
}

function initializeCommunities() {
  return this.$http.get(`/organizations/${this.organization.id}/communities`)
    .then(response => response.json())
    .then(communities => this.communities = communities)
    .then(communities => this.community = communities[0]);
}
</script>
