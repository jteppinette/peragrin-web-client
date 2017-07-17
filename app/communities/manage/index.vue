<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Communities</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap>
    <v-flex xs12 md6 v-for="community in communities" :key="community.id" v-if="community">
      <v-card>
        <v-card-title primary-title class="primary headline">{{ community.name }}</v-card-title>
        <communities-map :community="community"></communities-map>
        <v-card-actions><v-btn flat :to="`/communities/${community.id}`">Manage</v-btn></v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communitiesMap from 'common/communities/map';

export default {
  components: {communitiesMap},
  computed: {
    account () {
      return this.$store.state.account;
    },
    communities () {
      if (!this.account || !this.account.organizations || !this.account.organizations.length) return undefined;
      var l = [];
      for (let i in this.account.organizations) {
        let organization = this.account.organizations[i];
        if (!organization.communities) continue;
        l = l.concat(organization.communities.filter(c => !l.find(v => v.id == c.id)));
      }
      return l;
    }
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
