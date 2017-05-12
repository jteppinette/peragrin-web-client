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

        <v-divider></v-divider>

        <v-subheader v-if="organization.lon && organization.lat">Map</v-subheader>
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

export default {
  data: () => ({step: 1, organization}),
  methods: {
    setupBusiness
  },
  components: {
    organizationMap
  }
};

function setupBusiness() {
  var self = this;
  return this.$http.post('/organizations', this.organization)
    .then(response => response.json())
    .then(function({lon, lat}) {
      self.organization.lon = lon;
      self.organization.lat = lat;
    })
    .then(() => self.step = 2);
}
</script>
