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

@import '~vuetify/src/stylus/tools/_mixins'
@import './node_modules/vuetify/src/stylus/generic/*'
@import './node_modules/vuetify/src/stylus/elements/*'
@import './node_modules/vuetify/src/stylus/components/*'
@import './node_modules/vuetify/src/stylus/trumps/*'

html, body {
  background-color: white;
}
</style>
