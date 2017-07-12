<template>
<router-view></router-view>
</template>

<script>
export default {
  mounted () {
    return this.$store.dispatch('initialize');
  }
}
</script>

<style lang="stylus">
@import './settings';

@import './node_modules/vuetify/src/stylus/tools/*'
@import './node_modules/vuetify/src/stylus/generic/*'
@import './node_modules/vuetify/src/stylus/elements/*'
@import './node_modules/vuetify/src/stylus/components/*'
@import './node_modules/vuetify/src/stylus/trumps/*'

html, body {
  background-color: white;
}

html {
  padding-right: 0px !important;
}

.input-group--error {
  .icon {
    color: red !important;
  }
}

.alert {
  margin-top: 0px;
  text-transform: capitalize;
}

.toolbar {
  z-index: 4 !important;

  &__title {
    font-family: 'Fredoka One', Roboto, sans-serif;
  }
}
</style>
