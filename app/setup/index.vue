<template>
<v-app footer top-toolbar class="setup">
  <v-toolbar class="elevation-0">
    <v-toolbar-title>Setup</v-toolbar-title>
  </v-toolbar>
  <main>
    <v-content>
      <v-container fluid class="pa-3">
        <router-view></router-view>
      </v-container>
    </v-content>
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
