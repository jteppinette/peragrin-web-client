<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="stylus">
@import 'base';

@import '~vuetify/src/stylus/tools/_mixins'
@import '~vuetify/src/stylus/generic/_reset'
@import '~vuetify/src/stylus/generic/_grid'
@import '~vuetify/src/stylus/generic/_bootstrap'
@import '~vuetify/src/stylus/generic/_transitions'
@import '~vuetify/src/stylus/elements/_blockquote'
@import '~vuetify/src/stylus/elements/_code'
@import '~vuetify/src/stylus/elements/_global'
@import '~vuetify/src/stylus/elements/_headings'
@import '~vuetify/src/stylus/elements/_typography'
@import '~vuetify/src/stylus/components/_alerts'
@import '~vuetify/src/stylus/components/_avatars'
@import '~vuetify/src/stylus/components/_badges'
@import '~vuetify/src/stylus/components/_breadcrumbs'
@import '~vuetify/src/stylus/components/_buttons'
@import '~vuetify/src/stylus/components/_button-dropdown'
@import '~vuetify/src/stylus/components/_button-toggle'
@import '~vuetify/src/stylus/components/_cards'
@import '~vuetify/src/stylus/components/_carousel'
@import '~vuetify/src/stylus/components/_chips'
@import '~vuetify/src/stylus/components/_datatables'
@import '~vuetify/src/stylus/components/_date-picker'
@import '~vuetify/src/stylus/components/_dialogs'
@import '~vuetify/src/stylus/components/_dividers'
@import '~vuetify/src/stylus/components/_expansion-panel'
@import '~vuetify/src/stylus/components/_icons'
@import '~vuetify/src/stylus/components/_input-groups'
@import '~vuetify/src/stylus/components/_footer'
@import '~vuetify/src/stylus/components/_lists'
@import '~vuetify/src/stylus/components/_menus'
@import '~vuetify/src/stylus/components/_toolbar'
@import '~vuetify/src/stylus/components/_overlay'
@import '~vuetify/src/stylus/components/_pagination'
@import '~vuetify/src/stylus/components/_parallax'
@import '~vuetify/src/stylus/components/_pickers'
@import '~vuetify/src/stylus/components/_progress-circular'
@import '~vuetify/src/stylus/components/_progress-linear'
@import '~vuetify/src/stylus/components/_ripple'
@import '~vuetify/src/stylus/components/_select'
@import '~vuetify/src/stylus/components/_selection-controls'
@import '~vuetify/src/stylus/components/_sidebar'
@import '~vuetify/src/stylus/components/_sliders'
@import '~vuetify/src/stylus/components/_small-dialog'
@import '~vuetify/src/stylus/components/_subheaders'
@import '~vuetify/src/stylus/components/_steppers'
@import '~vuetify/src/stylus/components/_tables'
@import '~vuetify/src/stylus/components/_tabs'
@import '~vuetify/src/stylus/components/_text-fields'
@import '~vuetify/src/stylus/components/_time-picker'
@import '~vuetify/src/stylus/components/_toasts'
@import '~vuetify/src/stylus/components/_tooltips'
@import '~vuetify/src/stylus/trumps/_app'
@import '~vuetify/src/stylus/trumps/_display'
@import '~vuetify/src/stylus/trumps/_helpers'
@import '~vuetify/src/stylus/trumps/_spacing'
@import '~vuetify/src/stylus/trumps/_text'
@import '~vuetify/src/stylus/components/_snackbars'
@import '~vuetify/src/stylus/components/_bottom-nav'

@import "~leaflet/dist/leaflet.css";

html, body {
  background-color: white;
}

.leaflet-container {
  z-index: 5;
  height: 350px !important;
}

.col > .stepper, .col > .card {
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
</style>
