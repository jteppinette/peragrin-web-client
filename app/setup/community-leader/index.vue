<template>
<div class="community-leader">

  <v-row>

    <v-col lg8 md6 sm12 xs12>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step step="1" v-bind:complete="step > 1">Organization</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2" v-bind:complete="step > 2">Map</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" v-bind:complete="step > 3">Community</v-stepper-step>
        </v-stepper-header>

        <v-stepper-content step="1">
          <v-container>
            <organization-form v-model="organization"></organization-form>
            <v-btn primary @click.native="setupOrganization">Setup Organization</v-btn>
          </v-container>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-map v-if="step == 2 && organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
            <v-marker v-on:l-move="move" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true">
               <v-popup :content="organization.name"></v-popup>
            </v-marker>
          </v-map>
          <v-btn primary @click.native="updateOrganizationLocation">Update Organization Location</v-btn>
          <v-btn flat @click.native="step = 3">Continue</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-container>
            <v-text-field v-model="community.name" type="text" label="Name"></v-text-field>
            <v-btn primary @click.native="createCommunity">Create Community</v-btn>
          </v-container>
        </v-stepper-content>

      </v-stepper>
    </v-col>

    <v-col lg4 md6 sm12 xs12>
      <organization-card :organization="organization" :communities="community.name ? [community] : []"></organization-card>
    </v-col>

  </v-row>

</div>
</template>

<script>
import organizationCard from 'common/organization/card';
import organizationForm from 'common/organization/form';

var organization = {
  name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  zip: ''
};

var community = {
  name: ''
}

var marker = {
  lat: undefined,
  lng: undefined
}

export default {
  data: () => ({step: 1, organization, marker, community}),
  methods: {
    setupOrganization,
    move,
    updateOrganizationLocation,
    createCommunity
  },
  components: {
    organizationCard,
    organizationForm
  }
};

function createCommunity() {
  return this.$http.post(`/organizations/${this.organization.id}/communities`, this.community)
    .then(response => response.json())
    .then(community => this.community = community)
    .then(() => this.$router.push('/console/overview'));
}

function setupOrganization() {
  return this.$http.post('/organizations', this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization)
    .then(() => this.step = 2);
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
