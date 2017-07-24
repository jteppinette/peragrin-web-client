<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item to="/communities">Communities</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled v-if="community">{{ community.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <!-- COMMUNITY ORGANIZATIONS LIST -->
  <v-layout row wrap v-if="community">
    <v-flex xs12>
      <v-card>
        <v-card-title primary-title class="primary headline">{{ community.name }}</v-card-title>
        <communities-organizations-list :community="community" :search="selected.name"></communities-organizations-list>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap v-if="community">

    <!-- MEMBERSHIPS -->
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary title">Memberships</v-card-title>
        <memberships-list :communityID="id" :isAdministrator="isAdministrator"></memberships-list>
      </v-card>
    </v-flex>

    <!-- MAP -->
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary title">Map</v-card-title>
        <communities-map :community="community" @select="organization => selected = organization"></communities-map>
      </v-card>
    </v-flex>

  </v-layout>

</v-container>
</template>

<script>
import communitiesOrganizationsList from 'common/communities/organizations/list';
import communitiesMap from 'common/communities/map';
import membershipsList from 'common/memberships/list';

export default {
  props: ['id'],
  data: () => ({community: undefined, selected: {}, isAdministrator: false}),
  components: {communitiesOrganizationsList, communitiesMap, membershipsList},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  mounted: initialize,
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  },
  methods: {initializeCommunity, initializeIsAdministrator}
};

function initialize() {
  return Promise.all([
    this.$store.dispatch('initialize').then(this.initializeIsAdministrator),
    this.initializeCommunity()
  ]);
}

function initializeIsAdministrator() {
    return this.isAdministrator = this.account.isSuper || !!(this.account.organizations && this.account.organizations.find(v => v.communities ? v.communities.find(c => c.isAdministrator && c.id == this.id) : undefined));
}

function initializeCommunity() {
  return this.$http.get(`/communities/${this.id}`)
    .then(({data: community}) => this.community = community);
}
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 300px;
}
</style>
