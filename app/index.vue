<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="stylus">
@import 'base';

@import '~vuetify/src/stylus/tools/_mixins'
@import '../node_modules/vuetify/src/stylus/generic/*'
@import '../node_modules/vuetify/src/stylus/elements/*'
@import '../node_modules/vuetify/src/stylus/components/*'
@import '../node_modules/vuetify/src/stylus/trumps/*'

@import "~leaflet/dist/leaflet.css";

html, body {
  background-color: white;
}

.leaflet-container {
  z-index: 5;
  height: 350px !important;
}

.flex > .stepper, .flex > .card {
  margin-bottom: 10px;
}

.card__title.primary {
  color: white;
  font-family: 'Fredoka One', cursive;
}

.container > .subheader {
  padding: 0px;
}

.input-group {
  margin: 0px;
  margin-top: 10px;
}

.stepper, .stepper__content, .stepper__wrapper {
  overflow: visible;
}
</style>
