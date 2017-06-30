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
      <v-stepper-step step="3" v-bind:complete="step > 3">Map</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4" v-bind:complete="step > 4">Community</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md6 class="pr-5">
            <organization-form v-model="organization"></organization-form>
          </v-flex>
          <v-flex xs12 md6>
            <organization-hours v-model="organization.hours"></organization-hours>
          </v-flex>
        </v-layout>
        <v-btn primary @click.native="setupBusiness" class="white--text">Setup Business</v-btn>
      </v-container>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-container fluid v-if="organization.id">
        <v-subheader>All images will be sized to a maxium size of 130px in width and 400px in height. The provided image's aspect ratio will be maintained.</v-subheader>
        <dropzone id="myVueDropzone" param-name="logo" :url="`/organizations/${organization.id}/logo`" :headers="{'Authorization': `Bearer ${token}`}" @vdropzone-success="(file, {logo}) => organization.logo = logo" :resize-width="400" resize-method="crop" :resize-height="130" :thumbnail-width="400" :thumbnail-height="130" :max-number-of-files="1" :max-file-size-in-m-b="100"><input type="hidden"></dropzone>
        <v-btn flat @click.native="step = 3">Continue</v-btn>
      </v-container>
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-map v-if="step == 3 && organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
        <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
        <v-marker v-on:l-move="move" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true">
           <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
      <v-btn primary @click.native="updateBusinessLocation" class="white--text">Update Business Location</v-btn>
      <v-btn flat @click.native="step = 4">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="4">
      <v-container class="community-picker">
        <v-select label="Community" return-object hint="Choose the community you would like to join" persistent-hint :items="communities" v-model="community" auto item-text="name" item-value="name" />
        <v-btn primary @click.native="join" class="white--text">Join Community</v-btn>
        <v-btn primary :router="true" to="/organizations" class="white--text">Continue to Console</v-btn>
      </v-container>
    </v-stepper-content>

  </v-stepper>
</v-container>
</template>

<script>
import organizationForm from 'common/organization/form';
import organizationHours from 'common/organization/hours';
import Dropzone from 'vue2-dropzone';

var organization = {
  name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  email: '',
  phone: '',
  website: '',
  hours: [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}]
};

var marker = {
  lat: undefined,
  lng: undefined
};

export default {
  data: () => ({step: 1, organization, marker, communities: [], community: {}, error: false, msg: '', token: sessionStorage.token}),
  mounted: mounted,
  methods: {setupBusiness, move, updateBusinessLocation, join},
  components: {organizationForm, organizationHours, Dropzone}
};

function mounted() {
  return this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.communities = communities);
}

function join() {
  return this.$http.post(`/organizations/${this.organization.id}/communities/${this.community.id}`)
    .then(() => this.$router.push('/organizations'));
}

function setupBusiness() {
  return this.$http.post('/auth/organizations', this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization)
    .then(() => this.step = 2)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function move({latlng}) {
  this.marker.lat = latlng.lat;
  this.marker.lon = latlng.lng;
}

function updateBusinessLocation() {
  if (!this.marker.lat || !this.marker.lon) return;

  this.organization.lat = this.marker.lat;
  this.organization.lon = this.marker.lon;

  return this.$http.post(`/organizations/${this.organization.id}`, this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization);
}
</script>
