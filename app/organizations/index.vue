<template>
<v-container>
  <v-card v-if="community">
    <v-card-title class="primary">{{ community.name }}</v-card-title>
    <community-organizations-list :community="community"></community-organizations-list>
  </v-card>
</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';

export default {
  components: {communityOrganizationsList},
  computed: {
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
