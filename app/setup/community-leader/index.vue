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
      <v-divider></v-divider>
      <v-stepper-step step="3" v-bind:complete="step > 3">Invite Operators</v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1">
      <v-alert error dismissible v-model="error.organization">{{ msg.organization }}</v-alert>
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
      <v-btn primary @click="createOrganization" :error="error.organization" :loading="submitting.organization" class="white--text">Setup Business</v-btn>
    </v-stepper-content>

    <v-stepper-content step="2">
      <v-alert error dismissible v-model="error.community">{{ msg.community }}</v-alert>
      <v-container>
        <v-text-field v-model="community.name" type="text" label="Name"></v-text-field>

        <v-subheader>Set the zoom level and map center for your community</v-subheader>
        <v-map v-if="step == 2" :zoom="community.zoom" :center="[community.lat, community.lon]" v-on:l-zoomend="({target: {_zoom: v}}) => community.zoom = v">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :icon="icon" v-on:l-move="moveCommunity" :lat-lng="[community.lat, community.lon]" :draggable="true"></v-marker>
        </v-map>

        <v-btn primary @click="createCommunity" :error="error.community" :loading="submitting.community" class="white--text">Create Community</v-btn>
      </v-container>
    </v-stepper-content>

    <v-stepper-content step="3">
      <v-alert error dismissible v-model="error.operators">{{ msg.operators }}</v-alert>

      <v-container class="subheading">
        <v-layout row wrap>
          <v-flex md5 xs12>
            <p>Upload a CSV file of those people who operate businesses in your community. Their accounts will be created and they will be sent activation emails. Upon activation, they will be prompted to setup their businesses and join your community.</p>
          </v-flex>
          <v-flex md2 xs12></v-flex>
          <v-flex md5 xs12>
            <p>Download this <a href="/assets/templates/operators.csv">example csv</a> to see a properly formatted csv file. Remember, there should be no spaces before or after the delimer.</p>
          </v-flex>
        </v-layout>
        <v-btn :primary="!operators" class="mt-2 ma-0 file">{{ operators ? 'Select New CSV File' : 'Select CSV File' }}<input @change="selectCSVFile" type="file"></v-btn>

        <v-card v-if="operators" class="mt-3 mb-3">
          <v-card-title class="primary title">Parsed Operators</v-card-title>
          <v-data-table :headers="headers" :items="operators">
            <template slot="items" scope="props">
              <td class="text-xs-right">{{ props.item.email }}</td>
              <td class="text-xs-right">{{ props.item.firstName }}</td>
              <td class="text-xs-right">{{ props.item.lastName }}</td>
            </template>
          </v-data-table>
          <v-card-actions class="secondary">
            <v-spacer></v-spacer>
            <v-btn flat class="white--text" @click="operators = undefined">Cancel</v-btn>
            <v-btn outline class="white--text" @click="addOperators" :error="error.operators" :loading="submitting.operators" type="submit">Add Operators</v-btn>
          </v-card-actions>
        </v-card>

        <v-btn to="/communities" class="mt-2 ma-0">Continue to Console</v-btn>
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
import Papa from 'papaparse';

const headers = [
  {text: 'Email', value: 'email', sortable: true},
  {text: 'First Name', value: 'firstName', sortable: true},
  {text: 'Last Name', value: 'lastName', sortable: true}
];

let georgia = STATES.find(s => s.code == 'GA'),
    organization = {
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
    },
    error = {community: false, organization: false, operators: false},
    success = {operators: false},
    msg = {community: '', organization: '', operators: ''},
    submitting = {community: false, organization: false, operators: false};

export default {
  data: () => ({headers, operators: undefined, zoom: 6, step: undefined, organization, community, submitting, error, msg, success}),
  methods: {selectCSVFile, createOrganization, moveOrganization: _.debounce(moveOrganization, 500), moveCommunity: _.debounce(moveCommunity, 500), createCommunity, addOperators},
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

function addOperators() {
  this.submitting.operators = true;
  return this.$http.post(`/communities/${this.community.id}/accounts`, this.operators, {headers: {'X-Action': 'bulk'}})
    .then(() => this.success.operators = true)
    .catch(({data}) => this.error.operators = !!(this.msg.operators = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.operators = undefined)
    .then(() => this.submitting.operators = false)
    .then(() => this.$router.push('/communities'));
}

function selectCSVFile(e) {
  if (!e.target.files[0]) return;
  Papa.parse(e.target.files[0], {
    complete: results => {
      let headers = ['email', 'firstName', 'lastName'];
      let operators = results.data.map(record => {
        let operator = {};
        for (let i = 0; i < 3 && record.length; i++) {
          operator[headers[i]] = record.shift().trim();
        }
        return operator;
      });
      this.operators = operators.filter(o => o.email);
      e.target.value = "";
    }
  });
}

function createCommunity() {
  this.submitting.community = true;
  return this.$http.post(`/organizations/${this.organization.id}/communities`, this.community)
    .then(({data: community}) => this.community = community)
    .then(community => this.$store.commit('addCommunity', community.id))
    .then(community => this.step = 3)
    .catch(({data}) => this.error.community = !!(this.msg.community = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting.community = false);
}

function createOrganization() {
  this.submitting.organization = true;
  return this.$http.post(`/accounts/${this.account.id}/organizations`, this.organization)
    .then(({data: organization}) => {
      this.$store.commit('addOrganization', organization.id);
      return this.organization = organization;
    })
    .then(({lon, lat}) => this.community = {...this.community, lon, lat})
    .then(() => this.step = 2)
    .catch(({data}) => this.error.organization = !!(this.msg.organization = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting.organization = false);
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
