<template>
<router-view class="setup"></router-view>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>

<style lang="stylus">
.setup .leaflet-container {
  height: 350px;
}
</style>
