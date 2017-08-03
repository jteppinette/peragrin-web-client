<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Community Leader Setup</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-stepper v-model="step">

    <v-stepper-header>
      <v-stepper-step step="1" v-bind:complete="step > 1">Organization</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" v-bind:complete="step > 2">Community</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <organizations-form v-model="organization" @geo-hit="() => zoom = 15" @geo-miss="() => zoom = 6"></organizations-form>
          <p>If necessary, move the marker to adjust the organization's icon location on the map.</p>
          <v-map v-if="step == 1 && organization.lon && organization.lat" :zoom="zoom" :center="[organization.lat, organization.lon]" @l-zoomend="({target: {_zoom: v}}) => zoom = v">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
            <v-marker v-on:l-move="moveOrganization" :icon="icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true"></v-marker>
          </v-map>
        </v-flex>
        <v-flex xs12 md6>
          <organizations-hours v-model="organization.hours"></organizations-hours>
        </v-flex>
      </v-layout>
      <v-btn primary @click.native="createOrganization" class="white--text">Setup Business</v-btn>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-container>
        <v-text-field v-model="community.name" type="text" label="Name"></v-text-field>

        <v-subheader>Set the zoom level and map center for your community</v-subheader>
        <v-map v-if="step == 2" :zoom="community.zoom" :center="[community.lat, community.lon]" v-on:l-zoomend="({target: {_zoom: v}}) => community.zoom = v">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :icon="icon" v-on:l-move="moveCommunity" :lat-lng="[community.lat, community.lon]" :draggable="true"></v-marker>
        </v-map>

        <v-btn primary @click.native="createCommunity" class="white--text">Create Community</v-btn>
      </v-container>
    </v-stepper-content>

  </v-stepper>
</v-container>
</template>

<script>
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';
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
    category: 'Community Leader'
  },
  community = {
    name: '',
    zoom: 13,
    lon: 0,
    lat: 0
  };

export default {
  data: () => ({zoom: 6, step: undefined, organization, community, error: false, msg: ''}),
  methods: {createOrganization, moveOrganization: _.debounce(moveOrganization, 500), moveCommunity: _.debounce(moveCommunity, 500), createCommunity},
  components: {organizationsForm, organizationsHours},
  computed: {
    account () {
      return this.$store.state.account;
    },
    icon () {
      return this.organization.category ? MARKERS[this.organization.category] : undefined;
    },
  }
};

function createCommunity() {
  return this.$http.post(`/organizations/${this.organization.id}/communities`, this.community)
    .then(({data: community}) => this.community = community)
    .then(community => this.$router.push('/communities'));
}

function createOrganization() {
  return this.$http.post(`/accounts/${this.account.id}/organizations`, this.organization)
    .then(({data: organization}) => this.organization = organization)
    .then(({lon, lat}) => this.community = {...this.community, lon, lat})
    .then(() => this.step = 2)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function moveOrganization({latlng}) {
  this.organization.lat = latlng.lat;
  this.organization.lon = latlng.lng;
}

function moveCommunity({latlng}) {
  this.community.lat = latlng.lat;
  this.community.lon = latlng.lng;
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 150px;
}
</style>
