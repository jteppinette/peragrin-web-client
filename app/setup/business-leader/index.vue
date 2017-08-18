<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Business Leader Setup</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-stepper v-model="step">

    <v-stepper-header>
      <v-stepper-step step="1" v-bind:complete="step > 1">Business</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" v-bind:complete="step > 2">Logo</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" v-bind:complete="step > 3">Community</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <organizations-form v-model="organization" @geo-hit="() => zoom = 15" @geo-miss="() => zoom = 6"></organizations-form>
          <p>If necessary, move the marker to adjust the organization's icon location on the map.</p>
          <v-map v-if="step == 1 && organization.lon && organization.lat" :zoom="zoom" :center="[organization.lat, organization.lon]" @l-zoomend="({target: {_zoom: v}}) => zoom = v">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
            <v-marker v-on:l-move="move" :icon="icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true"></v-marker>
          </v-map>
        </v-flex>

        <v-flex xs12 md6>
          <organizations-hours v-model="organization.hours"></organizations-hours>
        </v-flex>
      </v-layout>
      <v-btn primary @click="create" class="white--text">Setup Business</v-btn>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-container fluid v-if="organization.id">
        <p>All images will be sized to a maxium size of 130px in width and 400px in height. The provided image's aspect ratio will be maintained.</p>
        <dropzone id="myVueDropzone" param-name="logo" :url="`/organizations/${organization.id}/logo`" :headers="{'Authorization': `Bearer ${account.token}`}" @vdropzone-success="(file, {logo}) => organization.logo = logo" :resize-width="400" resize-method="crop" :resize-height="130" :thumbnail-width="400" :thumbnail-height="130" :max-number-of-files="1" :max-file-size-in-m-b="100"><input type="hidden"></dropzone>
        <v-btn flat @click="step = 3">Continue</v-btn>
      </v-container>
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-container class="community-picker">
        <v-select label="Community" return-object hint="Choose the community you would like to join" persistent-hint :items="communities" v-model="community" auto item-text="name" item-value="name" />
        <v-btn primary @click="join" class="white--text">Join Community</v-btn>
        <v-btn primary :router="true" to="/organizations" class="white--text">Continue to Console</v-btn>
      </v-container>
    </v-stepper-content>

  </v-stepper>
</v-container>
</template>

<script>
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';
import Dropzone from 'vue2-dropzone';
import {MARKERS} from 'common/categories';
import {STATES} from 'common/geo';
import _ from 'lodash';

let georgia = STATES.find(s => s.code == 'GA');

var organization = {
  name: '',
  street: '',
  city: '',
  state: georgia.code,
  country: 'US',
  zip: '',
  lon: georgia.lon,
  lat: georgia.lat,
  email: '',
  phone: '',
  website: '',
  hours: [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}],
  category: ''
};

export default {
  data: () => ({zoom: 6, step: undefined, organization, communities: [], community: {}, error: false, msg: ''}),
  mounted: initialize,
  methods: {create, move: _.debounce(move, 500), join},
  components: {organizationsForm, organizationsHours, Dropzone},
  computed: {
    account () {
      return this.$store.state.account;
    },
    icon () {
      return this.organization.category ? MARKERS[this.organization.category] : undefined;
    }
  }
};

function initialize() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities);
}

function join() {
  return this.$http.post(`/organizations/${this.organization.id}/communities/${this.community.id}`)
    .then(() => this.$router.push('/organizations'));
}

function create() {
  return this.$http.post(`/accounts/${this.account.id}/organizations`, this.organization)
    .then(({data: organization}) => this.organization = organization)
    .then(organization => this.$store.commit('addOrganization', organization.id))
    .then(() => this.step = 2)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function move({latlng}) {
  this.organization.lat = latlng.lat;
  this.organization.lon = latlng.lng;
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 150px;
}
</style>
