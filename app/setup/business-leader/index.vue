<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Business Leader Setup</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-stepper alt-labels v-model="step">

    <v-stepper-header>
      <v-stepper-step step="1" v-bind:complete="step > 1">Business</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" v-bind:complete="step > 2">Logo</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3" v-bind:complete="step > 3">Join a Community<small>optional</small></v-stepper-step>
    </v-stepper-header>

    <!-- BUSINESS -->
    <v-stepper-content step="1">
      <v-card>

        <v-card-text class="secondary expose">
          <p><strong>Congratulations!</strong> You have just begun your journey to create a business in Peragrin.</p>
          <p><strong>Why are we asking for this information?</strong></p>
          <p>The information being requested below <i>general - address - hours of operation</i> is used to create your listing in Peragrin. This listing is used in your Peragrin community maps.</p>
          <p>If you have any questions while setting up your business, reach out to us at <a href="mailto:support@peragrin.com?subject=Setting Up My Community">support@peragrin.com</a>.</p>
        </v-card-text>

        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 md6 class="pr-20-md">
              <organizations-form v-model="organization" @geo-hit="() => zoom = 15" @geo-miss="() => zoom = 6"></organizations-form>
              <p>If necessary, move the marker to adjust the organization's icon location on the map.</p>
              <v-map v-if="step == 1 && organization.lon && organization.lat" :zoom="zoom" :center="[organization.lat, organization.lon]" @l-zoomend="({target: {_zoom: v}}) => zoom = v">
                <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
                <v-marker v-on:l-move="move" :icon="icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :draggable="true"></v-marker>
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
          <v-btn outline @click="create" :error="error.organization" :loading="submitting.organization" class="white--text">Create</v-btn>
        </v-card-actions>

      </v-card>
    </v-stepper-content>

    <!-- LOGO -->
    <v-stepper-content step="2">
      <v-card v-if="organization.id">

        <v-card-text class="secondary expose">
          <p>Now that you have defined your organization. You will now need upload your business logo. This logo will be used to let patrons identify your business.</p>
          <p>All images will be sized to a maxium size of 130px in width and 400px in height. The provided image's aspect ratio will be maintained.</p>
        </v-card-text>

        <v-card-text>
          <dropzone id="dropzone" param-name="logo" :url="`/organizations/${organization.id}/logo`" :headers="{'Authorization': `Bearer ${account.token}`}" @vdropzone-success="(file, {logo}) => organization.logo = logo" :resize-width="400" resize-method="crop" :resize-height="130" :thumbnail-width="400" :thumbnail-height="130" :max-number-of-files="1" :max-file-size-in-m-b="100"><input type="hidden"></dropzone>
        </v-card-text>

        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn outline class="white--text" @click="step = 3">Continue</v-btn>
        </v-card-actions>

      </v-card>
    </v-stepper-content>

    <!-- JOIN -->
    <v-stepper-content step="3">
      <v-card>

        <v-card-text class="secondary expose">
          <p>The final step in the setup process is choosing a community to join. This step is optional. However, it is highly recommended to join a communuity.</p>
          <p>Joining a community allows your business to show up on the communties' map.</p>
          <p><i>If you were invited by a community, then join that community. Otherwise, choose a community that is nearest to your business.</i></p>
        </v-card-text>

        <v-card-text>
          <v-select label="Community" return-object hint="Choose the community you would like to join" persistent-hint :items="communities" v-model="community" auto item-text="name" item-value="name" />
        </v-card-text>

        <v-snackbar v-model="error.community" error>{{ msg.community }}
          <v-btn flat @click="error.community = false" class="white--text">close</v-btn>
        </v-snackbar>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn flat :router="true" to="/organizations" class="white--text">Continue to Console</v-btn>
          <v-btn outline @click="join" class="white--text">Join</v-btn>
        </v-card-actions>

      </v-card>
    </v-stepper-content>

  </v-stepper>
</v-container>
</template>

<script>
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';
import Dropzone from 'vue2-dropzone';
import {MARKERS} from 'common/categories';
import {STATES} from 'common/geo';
import _ from 'lodash';

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
      category: ''
    },
    error = {organization: false, community: false},
    msg = {organization: '', community: ''},
    submitting = {organization: false, community: false};

export default {
  data: () => ({zoom: 6, step: undefined, organization, communities: [], community: {}, error, msg, submitting}),
  mounted: initialize,
  methods: {create, move: _.debounce(move, 500), join},
  components: {organizationsForm, organizationsHours, Dropzone},
  computed: {
    account () {
      return this.$store.state.account;
    },
    icon () {
      return this.organization.category ? MARKERS[this.organization.category] : undefined;
    }
  }
};

function initialize() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities);
}

function join() {
  this.submitting.community = true;
  return this.$http.post(`/organizations/${this.organization.id}/communities/${this.community.id}`)
    .then(() => this.$router.push('/organizations'))
    .catch(({data}) => this.error.community = !!(this.msg.community = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting.community = false);
}

function create() {
  this.submitting.organization = true;
  return this.$http.post(`/accounts/${this.account.id}/organizations`, this.organization)
    .then(({data: organization}) => this.organization = organization)
    .then(organization => this.$store.commit('addOrganization', organization.id))
    .then(() => this.step = 2)
    .catch(({data}) => this.error.organization = !!(this.msg.organization = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting.organization = false);
}

function move({latlng}) {
  this.organization.lat = latlng.lat;
  this.organization.lon = latlng.lng;
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 250px;
}
</style>
