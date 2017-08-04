<template>
<router-view></router-view>
</template>

<style lang="stylus">
@import './settings';

@import './node_modules/vuetify/src/stylus/tools/*'
@import './node_modules/vuetify/src/stylus/generic/*'
@import './node_modules/vuetify/src/stylus/elements/*'
@import './node_modules/vuetify/src/stylus/components/*'
@import './node_modules/vuetify/src/stylus/trumps/*'

html {
  padding-right: 0px !important;
}

.alert {
  margin-top: 0px;
  text-transform: capitalize;
}

.btn:not(.btn--icon):focus .btn__content:before {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
