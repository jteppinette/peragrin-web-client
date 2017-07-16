<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item to="/communities">Communities</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled v-if="community">{{ community.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap v-if="community">
    <v-flex xs12>
      <v-card>
        <v-card-title primary-title class="primary headline">{{ community.name }}</v-card-title>
        <community-organizations-list :community="community" :selected="selected"></community-organizations-list>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap v-if="community">
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary" style="position: relative">
          <span class="title">Memberhips</span>
          <memberships-create-update :communityID="id" @created="() => getMemberships()">
            <template slot="activator" scope="props"><v-btn fab absolute bottom right><v-icon>{{ props.action.icon }}</v-icon></v-btn></template>
          </memberships-create-update>
        </v-card-title>
        <v-list two-line>
          <v-list-tile :to="isAdministrator ? `/communities/${community.id}/memberships/${membership.id}` : undefined" v-for="membership in memberships" :key="membership.id" v-if="membership">
            <v-list-tile-content>
              <v-list-tile-title>{{ membership.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ membership.description }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary title">Map</v-card-title>
        <community-map :community="community" @select="organization => selected = organization"></community-map>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import communityMap from 'common/community/map';
import membershipsCreateUpdate from 'common/memberships/create-update';

export default {
  props: ['id'],
  data: () => ({community: undefined, selected: undefined, memberships: undefined, isAdministrator: false}),
  components: {communityOrganizationsList, communityMap, membershipsCreateUpdate},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  mounted () {
    this.$store.dispatch('initialize')
      .then(() => {
        this.isAdministrator = !!(this.account.organizations && this.account.organizations.find(v => v.communities ? v.communities.find(c => c.isAdministrator && c.id == this.id) : undefined)); 
      });
    this.$http.get(`/communities/${this.id}`)
      .then(response => response.json())
      .then(community => this.community = community);
    this.getMemberships();
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  },
  methods: {getMemberships}
};

function getMemberships() {
  return this.$http.get(`/communities/${this.id}/memberships`)
    .then(response => response.json())
    .then(memberships => this.memberships = memberships)
}
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 300px;
}
</style>
