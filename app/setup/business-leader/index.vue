<template>
<v-layout row wrap>

  <v-flex lg8 md6 sm12 xs12>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step step="1" v-bind:complete="step > 1">Business</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" v-bind:complete="step > 2">Map</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" v-bind:complete="step > 3">Community</v-stepper-step>
      </v-stepper-header>

      <v-stepper-content step="1">
        <v-container fluid>
          <organization-form v-model="organization"></organization-form>
          <organization-hours v-model="hours"></organization-hours>
          <v-btn primary @click.native="setupBusiness" class="white--text">Setup Business</v-btn>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-map v-if="step == 2 && organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker v-on:l-move="move" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true">
             <v-popup :content="organization.name"></v-popup>
          </v-marker>
        </v-map>
        <v-btn primary @click.native="updateBusinessLocation" class="white--text">Update Business Location</v-btn>
        <v-btn flat @click.native="step = 3">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container class="community-picker">
          <v-select label="Community" return-object hint="Choose the community you would like to join" persistent-hint :items="communities" v-model="community" auto item-text="name" item-value="name" />
          <v-btn primary @click.native="join" class="white--text">Join Community</v-btn>
          <v-btn primary :router="true" to="/console/overview" class="white--text">Continue to Console</v-btn>
        </v-container>
      </v-stepper-content>

    </v-stepper>
  </v-flex>

  <v-flex lg4 md6 sm12 xs12>
    <organization-card :organization="organization" :hours="hours" :communities="community.id ? [community] : []" class="elevation-1"></organization-card>
  </v-flex>

</v-layout>
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
  website: ''
};

var hours = [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}];

var marker = {
  lat: undefined,
  lng: undefined
}

export default {
  data: () => ({step: 1, organization, marker, communities: [], community: {}, hours}),
  mounted: mounted,
  methods: {
    setupBusiness,
    move,
    updateBusinessLocation,
    join
  },
  components: {
    organizationCard,
    organizationForm,
    organizationHours
  }
};

function mounted() {
  return this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.communities = communities);
}

function join() {
  return this.$http.post(`/organizations/${this.organization.id}/communities/${this.community.id}`)
    .then(() => this.$router.push('/console/overview'));
}

function setupBusiness() {
  return this.$http.post('/auth/organizations', this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization)
    .then(organization => this.$http.post(`/organizations/${organization.id}/hours`, this.hours))
    .then(() => this.step = 2);
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
