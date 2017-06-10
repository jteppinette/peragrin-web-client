<template>
<v-container>
  <v-stepper v-model="step">

    <v-stepper-header>
      <v-stepper-step step="1" v-bind:complete="step > 1">Organization</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" v-bind:complete="step > 2">Map</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" v-bind:complete="step > 3">Community</v-stepper-step>
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
        <v-btn primary @click.native="setupOrganization" class="white--text">Setup Organization</v-btn>
      </v-container>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-map v-if="step == 2 && organization.lon && organization.lat" :zoom="zoom" :center="[organization.lat, organization.lon]" v-on:l-zoomend="({target: {_zoom: v}}) => zoom = v">
        <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
        <v-marker v-on:l-move="move" :lat-lng="[marker.lat, marker.lon]" :draggable="true">
           <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
      <v-btn primary @click.native="updateOrganizationLocation" class="white--text">Update Organization Location</v-btn>
      <v-btn flat @click.native="step = 3">Continue</v-btn>
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-container>
        <v-text-field v-model="community.name" type="text" label="Name"></v-text-field>

        <v-subheader>Set the zoom level and map center for your community</v-subheader>
        <v-map v-if="step == 3" :zoom="zoom" :center="[organization.lat, organization.lon]" v-on:l-zoomend="({target: {_zoom: v}}) => zoom = v">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker v-on:l-move="move" :lat-lng="[marker.lat, marker.lon]" :draggable="true">
             <v-popup :content="community.name"></v-popup>
          </v-marker>
        </v-map>

        <v-btn primary @click.native="createCommunity" class="white--text">Create Community</v-btn>
      </v-container>
    </v-stepper-content>

  </v-stepper>
</v-container>
</template>

<script>
import organizationCard from 'common/organization/card';
import organizationForm from 'common/organization/form';
import organizationHours from 'common/organization/hours';

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
    hours: [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}],
  },
  community = {
    name: ''
  };

export default {
  data: () => ({zoom: 13, step: 1, organization, marker: undefined, community, error: false, msg: ''}),
  methods: {
    setupOrganization,
    move,
    updateOrganizationLocation,
    createCommunity
  },
  components: {
    organizationCard,
    organizationForm,
    organizationHours
  }
};

function createCommunity() {
  return this.$http.post(`/organizations/${this.organization.id}/communities`, {...this.community, zoom: this.zoom, lon: this.marker.lon, lat: this.marker.lat})
    .then(response => response.json())
    .then(community => this.community = community)
    .then(() => this.$router.push('/overview'));
}

function setupOrganization() {
  return this.$http.post('/auth/organizations', this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization)
    .then(organization => {
      this.marker = {lat: organization.lat, lon: organization.lon};
      return organization;
    })
    .then(() => this.step = 2)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function move({latlng}) {
  this.marker.lat = latlng.lat;
  this.marker.lon = latlng.lng;
}

function updateOrganizationLocation() {
  if (!this.marker.lat || !this.marker.lon) return;
  this.organization.lat = this.marker.lat;
  this.organization.lon = this.marker.lon;
  return this.$http.post(`/organizations/${this.organization.id}`, this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization);
}
</script>
