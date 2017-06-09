<template>
<v-container fluid class="pa-3">

  <!-- COMMUNITY LEADER -->
  <v-layout row wrap v-if="community && community.isAdministrator">
    <v-flex xs12 md6 lg6>
      <v-card v-if="community">
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :id="community.id"></community-organizations-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm4 md2 lg2>
      <v-card>
        <v-card-title class="primary">Memberhips</v-card-title>
        <memberships-list :communityID="community.id"></memberships-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm8 md4 lg4 v-if="organization">
      <organization-card :organization="organization" class="elevation-1"></organization-card>
    </v-flex>
  </v-layout>

  <!-- BUSINESS LEADER -->
  <v-layout row wrap v-else>
    <v-flex xs12 sm6 md8 lg8>
      <v-card v-if="community">
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :id="community.id"></community-organizations-list>
      </v-card>
      <v-card v-if="organization && community">
        <v-card-title class="primary">Promotions</v-card-title>
        <promotions-list :communityID="community.id" :organizationID="organization.id"></promotions-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6 md4 lg4 v-if="organization">
      <organization-card :organization="organization" class="elevation-1"></organization-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import organizationCard from 'common/organization/card';
import promotionsList from 'common/promotions/list';
import membershipsList from 'common/memberships/list';

export default {
  components: {
    communityOrganizationsList,
    organizationCard,
    promotionsList,
    membershipsList
  },
  computed: {
    organization () {
      return this.$store.state.organization;
    },
    community () {
      return this.$store.state.community;
    }
  },
  mounted () {
    return this.$store.dispatch('initialize');
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>
