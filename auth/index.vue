<template>
<v-app class="auth">
  <main>
    <v-container fluid>
      <h1>peragrin</h1>
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
    height: 100% !important;
    min-height: initial !important;
    background-color: white;
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
    text-align: center;
    padding: 48px;
    width: 100%;
    margin-bottom: 0px;
    border-bottom: 5px solid $theme.accent;
    background-color: #4DB880;
    color: white;
    font-family: 'Fredoka One', cursive;

    @media screen and (max-width: $grid-breakpoints.sm) {
      padding-left: 10px;
      padding-right: 10px;
    }

  }
}
</style>
