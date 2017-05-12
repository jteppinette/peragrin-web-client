<template>
<div class="business-leader">

  <v-row>

    <v-col xs8>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step step="1" v-bind:complete="step > 1">Setup Business</v-stepper-step>
          <v-divider />
          <v-stepper-step step="2" v-bind:complete="step > 2">Map</v-stepper-step>
          <v-divider />
          <v-stepper-step step="3" v-bind:complete="step > 3">Connect Community</v-stepper-step>
          <v-divider />
          <v-stepper-step step="4">Share</v-stepper-step>
        </v-stepper-header>

        <v-stepper-content step="1">

          <v-subheader><v-icon class="primary--text">info</v-icon> &nbsp; General</v-subheader>
          <v-row row>
            <v-col xs8 offset-xs2>
              <v-text-field v-model="organization.name" type="text" label="Name"></v-text-field>
            </v-col>
          </v-row>

          <v-subheader><v-icon class="primary--text">location_on</v-icon> &nbsp; Address</v-subheader>
          <v-row row>
            <v-col xs8 offset-xs2>
              <v-text-field v-model="organization.street" type="text" label="Street"></v-text-field>
            </v-col>
          </v-row>
          <v-row row>
            <v-col xs4 offset-xs2>
              <v-text-field v-model="organization.city" type="text" label="City"></v-text-field>
            </v-col>
            <v-col xs4>
              <v-text-field v-model="organization.state" type="text" label="State"></v-text-field>
            </v-col>
          </v-row>
          <v-row row>
            <v-col xs4 offset-xs2>
              <v-text-field v-model="organization.zip" type="text" label="Zip"></v-text-field>
            </v-col>
            <v-col xs4>
              <v-text-field v-model="organization.country" type="text" label="Country"></v-text-field>
            </v-col>
          </v-row>

          <v-btn primary @click.native="setupBusiness">Setup Business</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-map v-if="step == 2 && organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
            <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
            <v-marker v-on:l-move="move" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true">
               <v-popup :content="organization.name"></v-popup>
            </v-marker>
          </v-map>

          <v-btn primary @click.native="updateBusinessLocation">Update Business Location</v-btn>
          <v-btn flat @click.native="step = 3">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-btn primary @click.native="step = 4">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="4">
          <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px" />
          <v-btn primary >Continue to Console</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-col>

    <v-col xs4>
      <v-card>

        <v-card-row class="primary">
          <v-card-title><span class="white--text">{{ organization.name || 'Your Organization' }}</span></v-card-title>
        </v-card-row>

        <v-subheader>General</v-subheader>
        <v-card-row>
          <v-card-text>
            <strong>{{ organization.name }}</strong>
          </v-card-text>
        </v-card-row>

        <v-divider></v-divider>

        <v-subheader>Address</v-subheader>
        <v-card-row>
          <v-card-text>
            <blockquote>
              {{ organization.street }} <br/>
              {{ organization.city }} {{ organization.state }} {{ organization.zip }} <br/>
              {{ organization.country }}
            </blockquote>
          </v-card-text>
        </v-card-row>

        <v-card-row v-if="organization.lon && organization.lat">
          <organization-map :organization="organization"></organization-map>
        </v-card-row>

      </v-card>
    </v-col>

  </v-row>

</div>
</template>

<script>
import organizationMap from 'console/overview/organization-map';

var organization = {
  name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  lon: undefined,
  lat: undefined
};

var marker = {
  lat: undefined,
  lng: undefined
}

export default {
  data: () => ({step: 1, organization, marker}),
  methods: {
    setupBusiness,
    move,
    updateBusinessLocation
  },
  components: {
    organizationMap
  }
};

function setupBusiness() {
  return this.$http.post('/organizations', this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization)
    .then(() => this.step = 2);
}

function move({latlng}) {
  this.marker.lat = latlng.lat;
  this.marker.lon = latlng.lng;
}

function updateBusinessLocation() {
  this.organization.lat = this.marker.lat;
  this.organization.lon = this.marker.lon;

  return this.$http.post(`/organizations/${this.organization.id}`, this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization);
}
</script>
