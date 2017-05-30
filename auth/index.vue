<template>
<v-app class="auth">
  <main>
    <v-container fluid>
      <h1 class="pa-5 text-xs-center">peragrin</h1>
      <router-view></router-view>
    </v-container>
  </main>
</v-app>
</template>

<style lang="stylus">
@import '../settings';

.auth {
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
    overflow: hidden;
    padding: 0px;
    box-shadow: 0 8px 9px -5px rgba(0,0,0,.2),0 15px 22px 2px rgba(0,0,0,.14),0 6px 28px 5px rgba(0,0,0,.12) !important;

    @media screen and (max-width: $grid-breakpoints.sm) {
      max-width: none;
      box-shadow: none !important;
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
