<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Community Leader Setup</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-stepper alt-labels v-model="step">

    <v-stepper-header>
      <v-stepper-step step="1" v-bind:complete="step > 1">Managing Organization</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" v-bind:complete="step > 2">Community</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" v-bind:complete="step > 3">Invite Business Operators<small>optional</small></v-stepper-step>
    </v-stepper-header>

    <!-- MANAGING ORGANIZATION -->
    <v-stepper-content step="1">
      <v-card>

        <v-card-text class="secondary expose">
          <v-layout row wrap>
            <v-flex xs12 md6>
              <p><strong>Congratulations!</strong> You have just begun your journey to create a community in Peragrin.</p>
              <p>The first step is to create the communities managing organization. For example, this would be the <strong>chamber of commerce, city council, or community management corporation</strong>. This is the legal organization that provides oversight and management for the community you will be creating.</p>
            </v-flex>
            <v-flex xs12 md6>
              <p><strong>Why are we asking for this information?</strong></p>
              <p>The information being requested below <i>general - address - hours of operation</i> is used to create your listing in Peragrin. This is used <strong>to generate your unique map</strong> and <strong>let your community organizations and members know about your managing organization</strong>.</p>
              <p>If you have any questions while setting up your community, reach out to us at <a href="mailto:support@peragrin.com?subject=Setting Up My Community">support@peragrin.com</a>.</p>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 md6 class="pr-20-md">
              <organizations-form v-model="organization" @geo-hit="() => zoom = 15" @geo-miss="() => zoom = 6"></organizations-form>
              <p>If necessary, move the marker to adjust the organization's icon location on the map.</p>
              <v-map v-if="step == 1 && organization.lon && organization.lat" :zoom="zoom" :center="[organization.lat, organization.lon]" @l-zoomend="({target: {_zoom: v}}) => zoom = v">
                <v-tilelayer :url="URL"></v-tilelayer>
                <v-marker v-on:l-move="moveOrganization" :icon="icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true"></v-marker>
              </v-map>
            </v-flex>
            <v-flex xs12 md6 class="pl-10-md">
              <organizations-hours v-model="organization.hours"></organizations-hours>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-snackbar v-model="error.organization" error>{{ msg.organization }}
          <v-btn flat @click="error.organization = false" class="white--text">close</v-btn>
        </v-snackbar>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn outline @click="createOrganization" :error="error.organization" :loading="submitting.organization" class="white--text">Create</v-btn>
        </v-card-actions>

      </v-card>
    </v-stepper-content>

    <!-- COMMUNITY -->
    <v-stepper-content step="2">
      <v-card>

        <v-card-text class="secondary expose">
          <p>Now that you have defined your managing organization. You will now need to define the <strong>name and map settings for your community</strong>.</p>
        </v-card-text>

        <v-card-text>
          <v-text-field v-model="community.name" type="text" label="Name"></v-text-field>
        </v-card-text>

        <v-card-text class="secondary">
          <p>Use the map marker and zoom controls to set the initial center point and zoom level for your community map. This should be set so that <strong>all businesses in your community are visible at that zoom level and the marker is at the center focal point of your community</strong>. e.g. a city marker or court house</p>
        </v-card-text>

        <v-map v-if="step == 2" :zoom="community.zoom" :center="[community.lat, community.lon]" v-on:l-zoomend="({target: {_zoom: v}}) => community.zoom = v">
          <v-tilelayer :url="URL"></v-tilelayer>
          <v-marker :icon="icon" v-on:l-move="moveCommunity" :lat-lng="[community.lat, community.lon]" :draggable="true"></v-marker>
        </v-map>

        <v-snackbar v-model="error.community" error>{{ msg.community }}
          <v-btn flat @click="error.community = false" class="white--text">close</v-btn>
        </v-snackbar>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn outline @click="createCommunity" :error="error.community" :loading="submitting.community" class="white--text">Create</v-btn>
        </v-card-actions>

      </v-card>
    </v-stepper-content>

    <!-- INVITE BUSINESS OPERATORS -->
    <v-stepper-content step="3">
      <v-card>

        <v-card-text class="secondary expose">
          <v-layout row wrap>
            <v-flex xs12 md6>
              <p>This is the final stage in the community setup process! Here, you can <strong>invite those people who operate businesses in your community</strong>.</p>
              <p>This process is handled through a <strong>CSV file upload</strong> of your business operators. Download this <a href="/assets/templates/operators.csv">example csv</a> to see a properly formatted csv file. Remember, there should be no spaces before or after the delimiter.</p>
            </v-flex>
            <v-flex xs12 md6>
              <p>After you have uploaded the CSV file, confirm that the file was parsed correctly by inspecting the <i>Parsed Operators</i> table. If the operators are correct, then <strong>press <i>Add Operators</i> in the bottom right</strong>. This will trigger their accounts to be created and activation emails sent out.</p>
              <p>The activation email will take the operators through the business leader setup workflow and join their newly created organizations to your community.</p>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-text>
          <v-btn :primary="!operators" class="file">{{ operators ? 'Select New CSV File' : 'Select CSV File' }}<input @change="selectCSVFile" type="file"></v-btn>
        </v-card-text>

        <v-card-title v-if="operators" class="primary title">Parsed Operators</v-card-title>
        <v-data-table v-if="operators" :headers="headers" :items="operators">
          <template slot="items" scope="props">
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.firstName }}</td>
            <td class="text-xs-right">{{ props.item.lastName }}</td>
          </template>
        </v-data-table>

        <v-snackbar v-model="error.operators" error>{{ msg.operators }}
          <v-btn flat @click="error.operators = false" class="white--text">close</v-btn>
        </v-snackbar>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn flat v-if="!operators" to="/communities" class="white--text">Continue to Console</v-btn>
          <v-btn flat v-if="operators" @click="operators = undefined" class="white--text">Cancel</v-btn>
          <v-btn outline class="white--text" @click="addOperators" :error="error.operators" :loading="submitting.operators" type="submit">Add Operators</v-btn>
        </v-card-actions>

      </v-card>
    </v-stepper-content>

  </v-stepper>
</v-container>
</template>

<script>
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';
import {MARKERS} from 'common/categories';
import {STATES} from 'common/geo';
import {URL} from 'common/map';
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
  data: () => ({headers, operators: undefined, zoom: 6, step: undefined, organization, community, submitting, error, msg, success, URL}),
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
  height: 250px;
}
</style>
