<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item router to="/communities">Communities</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled>{{ community.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap v-if="community">
    <v-flex xs12 md8>
      <v-card>
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :community="community"></community-organizations-list>
      </v-card>
    </v-flex>
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="primary">Memberhips</v-card-title>
        <memberships-list :communityID="community.id"></memberships-list>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import membershipsList from 'common/memberships/list';

export default {
  props: ['id'],
  data: () => ({community: undefined}),
  components: {communityOrganizationsList, membershipsList},
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
