<template>
<v-container fluid class="pa-3">
  <router-view></router-view>
</v-container>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>
