<template>
<v-app class="setup">
  <v-container fluid class="pa-3">
    <router-view></router-view>
  </v-container>
</v-app>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/login', query: {redirect: to.fullPath}});
  }
};
</script>
