<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item router to="/communities">Communities</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled v-if="community">{{ community.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap v-if="community">
    <v-flex xs12>
      <v-card>
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :community="community" :selected="selected"></community-organizations-list>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap v-if="community">
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary">Memberhips</v-card-title>
        <memberships-list :communityID="community.id"></memberships-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary">Map</v-card-title>
        <community-map :community="community" @select="organization => selected = organization"></community-map>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import communityMap from 'common/community/map';
import membershipsList from 'common/memberships/list';

export default {
  props: ['id'],
  data: () => ({community: undefined, selected: undefined}),
  components: {communityOrganizationsList, membershipsList, communityMap},
  mounted () {
    this.$store.dispatch('initialize');
    this.$http.get(`/communities/${this.id}`)
      .then(response => response.json())
      .then(community => this.community = community);
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 300px;
}
</style>
