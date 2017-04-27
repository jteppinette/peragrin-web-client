<template>
<v-app class="unauthenticated">
  <v-container fluid class="elevation-15">
    <h1 class="pa-5 text-xs-center">peragrin</h1>
    <router-view></router-view>
  </v-container>
</v-app>
</template>

<script>
export default {
  beforeRouteEnter: (to, from, next) => next(sessionStorage.userID ? {path: '/overview'} : undefined)
};
</script>

<style lang="stylus">
.unauthenticated {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;

  .container {
    max-width: 500px;
  }

  h1 {
    width: 100%;
    background-color: #4DB880;
    color: white;
    font-family: 'Fredoka One', cursive;
  }

}
</style>
