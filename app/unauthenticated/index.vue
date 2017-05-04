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
@import '../base';

.unauthenticated {
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media screen and (max-width: $grid-breakpoints.sm) {
    display: inline;
    justify-content: flex-start;
    align-items: stretch;
    padding: 0px
  }

  .container {
    height: auto;
    max-width: 500px;

    @media screen and (max-width: $grid-breakpoints.sm) {
      max-width: none;
      height: 100%;
    }
  }

  h1 {
    width: 100%;
    background-color: #4DB880;
    color: white;
    font-family: 'Fredoka One', cursive;
  }

}
</style>
