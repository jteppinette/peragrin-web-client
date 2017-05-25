<template>
<v-app class="setup">
  <v-toolbar class="elevation-0">
    <v-toolbar-title>setup</v-toolbar-title>
  </v-toolbar>
  <main>
    <v-container fluid class="pa-3">
      <router-view></router-view>
    </v-container>
  </main>
  <v-footer></v-footer>
</v-app>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>

<style scoped lang="stylus">
.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
}
</style>

