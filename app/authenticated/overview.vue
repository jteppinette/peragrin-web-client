<template>
<div class="overview">

  <v-row>
    <v-col xs12>
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
    </v-col>
  </v-row>

  <v-row>
    <v-col xs12 lg6>
      <v-card class="elevation-3">
        <v-card-title class="primary white--text">Organizations</v-card-title>
        <v-data-table v-model="organizations" :headers="headers" hide-actions>
          <template slot="items" scope="props">
            <td class="text-xs-right">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.address }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col xs12 lg6 class="map">
      <v-card v-if="organization" class="elevation-3">
        <v-card-title class="primary white--text">Map</v-card-title>
        <v-map :zoom=15 :center="[organization.latitude, organization.longitude]">
          <v-tilelayer :token="mapboxAPIKey" url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={token}"></v-tilelayer>
          <v-marker :lat-lng="{'lat': organization.latitude, 'lng': organization.longitude}">
             <v-popup :content="organization.name"></v-popup>
          </v-marker>
        </v-map>
      </v-card>
    </v-col>
  </v-row>

</div>
</template>

<script>
import L from 'leaflet';

L.Icon.Default.imagePath = '/';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// TODO: sortable needs to be removed, bug fix in data table component required
const headers = [
  {
    text: 'Name',
    value: 'name',
    sortable: true
  },
  {
    text: 'Address',
    value: 'address',
    sortable: true
  }
];

export default {
  data: () => ({organization: undefined, organizations: [], headers, mapboxAPIKey: sessionStorage.mapboxAPIKey, step: 1}),
  mounted
};

function mounted () {
  this.$http.get('/organizations')
    .then(response => response.json())
    .then(function(organizations) {
        return organizations.map(function(v) {
          v.value = false;
          return v;
        });
    })
    .then((organizations) => this.organizations = organizations)
    .then((organizations) => this.organization = organizations.find((v) => v.id == sessionStorage.organizationID));
}
</script>

<style lang="stylus">
@import '../base';

$map-height := 400px;

.leaflet-container {
  z-index: 5;
  height: $map-height - 63 !important;
}

.overview .col {
  padding-bottom: 10px;
}

.map.card {
  height: $map-height;
}
</style>
