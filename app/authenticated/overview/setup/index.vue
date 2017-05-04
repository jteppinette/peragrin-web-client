<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step step="1" v-bind:complete="step > 1">Add Personal Information</v-stepper-step>
      <v-divider />
      <v-stepper-step step="2" v-bind:complete="step > 2">Add Business Information</v-stepper-step>
      <v-divider />
      <v-stepper-step step="3">Add Organizations</v-stepper-step>
    </v-stepper-header>
    <v-stepper-content step="1">
      <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px" />
      <v-btn primary @click.native="step = 2">Continue</v-btn>
      <v-btn flat>Cancel</v-btn>
    </v-stepper-content>
    <v-stepper-content step="2">
      <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px" />
      <v-btn primary @click.native="step = 3">Continue</v-btn>
      <v-btn flat>Cancel</v-btn>
    </v-stepper-content>
    <v-stepper-content step="3">
      <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px" />
      <v-btn primary @click.native="step = 1">Continue</v-btn>
      <v-btn flat>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data: () => ({step: 1})
}
</script>
