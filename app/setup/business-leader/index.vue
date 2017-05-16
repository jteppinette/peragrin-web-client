<template>
<div class="business-leader">

  <v-row>

    <v-col xs8>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step step="1" v-bind:complete="step > 1">Business</v-stepper-step>
          <v-divider />
          <v-stepper-step step="2" v-bind:complete="step > 2">Map</v-stepper-step>
          <v-divider />
          <v-stepper-step step="3" v-bind:complete="step > 3">Communities</v-stepper-step>
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
          <v-container fluid>
            <v-row>
              <v-col xs4>
                <v-subheader>Choose the communities you would like to join</v-subheader>
              </v-col>
              <v-col xs8>
                <v-select label="Communities" :items="communities.available" v-model="communities.selected" auto chips multiple light item-text="name" item-value="name" />
              </v-col>
            </v-row>
          </v-container>
          <v-btn primary @click.native="joinCommunities">Join Communities</v-btn>
          <v-btn flat @click.native="step = 4">Skip</v-btn>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card class="grey lighten-1 z-depth-1 mb-5" height="200px" />
          <v-btn primary :router="true" to="/console/overview">Continue to Console</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-col>

    <v-col xs4>
      <organization-card :organization="organization"></organization-card>
    </v-col>

  </v-row>

</div>
</template>

<script>
import organizationCard from 'common/organization/card';

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
  data: () => ({step: 1, organization, marker, communities: {selected: [], available: []}}),
  mounted: mounted,
  methods: {
    setupBusiness,
    move,
    updateBusinessLocation,
    joinCommunities
  },
  components: {
    organizationCard
  }
};

function mounted() {
  return this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.communities.available = communities);
}

function joinCommunities() {
  return this.$http.post(`/organizations/${this.organization.id}/communities`, this.communities.selected)
    .then(() => this.step = 4);
}

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
  if (!this.market.lat || !this.marker.long) return;

  this.organization.lat = this.marker.lat;
  this.organization.lon = this.marker.lon;

  return this.$http.post(`/organizations/${this.organization.id}`, this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization);
}
</script>

<style scoped lang="stylus">
$map-height := 400px;

.leaflet-container {
  z-index: 5;
  height: $map-height - 63 !important;
}
</style>
