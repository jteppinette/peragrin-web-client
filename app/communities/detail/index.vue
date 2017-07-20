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
        <v-card-title class="primary" style="position: relative">
          <span class="title">Memberhips</span>
          <v-btn v-if="isAdministrator" @click.native.stop="dialogs.membershipsCreateUpdate = !dialogs.membershipsCreateUpdate" fab absolute bottom right><v-icon>add</v-icon></v-btn>
          <memberships-create-update v-model="dialogs.membershipsCreateUpdate" :communityID="id" @created="() => initializeMemberships()">
          </memberships-create-update>
        </v-card-title>
        <v-card-text class="pb-5 pt-5">Click a membership below to view more detailed information and add accounts. If you do not have any memberships, click the plus button above to create your first membership.</v-card-text>
        <v-divider v-if="memberships.length"></v-divider>
        <v-list two-line>
          <v-list-tile :to="isAdministrator ? `/communities/${community.id}/memberships/${membership.id}` : undefined" v-for="membership in memberships" :key="membership.id" v-if="membership">
            <v-list-tile-content>
              <v-list-tile-title avatar>{{ membership.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ membership.description }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="isAdministrator">
              <v-btn icon @click.native.prevent="deleteMembership(membership.id)" class="secondary"><v-icon class="white--text">delete</v-icon></v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
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
import membershipsCreateUpdate from 'common/memberships/create-update';

let dialogs = {
  membershipsCreateUpdate: false
};

export default {
  props: ['id'],
  data: () => ({community: undefined, selected: {}, memberships: undefined, isAdministrator: false, dialogs}),
  components: {communitiesOrganizationsList, communitiesMap, membershipsCreateUpdate},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  mounted: initialize,
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  },
  methods: {initializeMemberships, initializeCommunity, initializeIsAdministrator, deleteMembership}
};

function initialize() {
  return Promise.all([
    this.$store.dispatch('initialize').then(this.initializeIsAdministrator),
    this.initializeMemberships(),
    this.initializeCommunity()
  ]);
}

function initializeIsAdministrator() {
    return this.isAdministrator = !!(this.account.organizations && this.account.organizations.find(v => v.communities ? v.communities.find(c => c.isAdministrator && c.id == this.id) : undefined)); 
}

function initializeCommunity() {
  return this.$http.get(`/communities/${this.id}`)
    .then(({data: community}) => this.community = community);
}

function initializeMemberships() {
  return this.$http.get(`/communities/${this.id}/memberships`)
    .then(({data: memberships}) => this.memberships = memberships)
}

function deleteMembership(id) {
  return this.$http.delete(`/memberships/${id}`)
    .then(this.initializeMemberships);
}
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 300px;
}
</style>
