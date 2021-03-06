<template>
<v-dialog v-model="value" width="800px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">{{ action.name }} Organization</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <organizations-form v-model="data" @geo-hit="() => zoom = 15" @geo-miss="() => zoom = 6"></organizations-form>

        <v-checkbox v-if="communityID && account.isSuper" label="Is Community Administrator?" v-model="data.isAdministrator"></v-checkbox>

        <p>If necessary, move the marker to adjust the organization's icon location on the map.</p>
        <v-map v-if="value && data.lon && data.lat" :zoom="zoom" :center="[data.lat, data.lon]" @l-zoomend="({target: {_zoom: v}}) => zoom = v">
          <v-tilelayer :url="URL"></v-tilelayer>
          <v-marker v-on:l-move="move" :icon="icon" :lat-lng="{'lat': data.lat, 'lng': data.lon}" draggable></v-marker>
        </v-map>

        <organizations-hours v-model="data.hours"></organizations-hours>

      </v-card-text>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">{{ action.name }}</v-btn>
      </v-card-actions>

      <v-snackbar v-if="value" v-model="error" error>{{ msg }}
        <v-btn flat @click="error = false" class="white--text">Close</v-btn>
      </v-snackbar>

    </form>
  </v-card>
</v-dialog>
</template>
<script>
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';
import {MARKERS} from 'common/categories';
import {STATES} from 'common/geo';
import {URL} from 'common/map';
import _ from 'lodash';

export default {
  props: ['organization', 'communityID', 'value'],
  data: () => ({zoom: 6, submitting: false, msg: '', error: false, data: {}, URL}),
  components: {organizationsForm, organizationsHours},
  computed: {
    icon () {
      return this.data.category ? MARKERS[this.data.category] : undefined;
    },
    account () {
      return this.$store.state.account;
    },
    action () {
      return this.organization ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    }
  },
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  },
  methods: {initialize, create, update, move: _.debounce(move, 500)},
};

function initialize() {
  let georgia = STATES.find(s => s.code == 'GA');
  this.submitting = false;
  this.msg = '';
  this.error = false;
  this.data = this.organization ? JSON.parse(JSON.stringify(this.organization)) : {
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
    category: '',
    isAdministrator: false
  };
  this.zoom = this.organization ? 15 : 6;
}

function move({latlng}) {
  this.$set(this.data, 'lon', latlng.lng);
  this.$set(this.data, 'lat', latlng.lat);
}

function update() {
  this.submitting = true;
  return this.$http.put(`/organizations/${this.organization.id}`, this.data)
    .then(({data: organization}) => this.$emit('updated', {...this.organization, ...organization}))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function create() {
  this.submitting = true;
  return this.$http.post(`/communities/${this.communityID}/organizations`, this.data)
    .then(({data: organization}) => {
      this.$emit('created', organization);
      this.$emit('input', false);
      this.$store.commit('addOrganization', organization.id);
    })
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 150px;
}

.subheader {
  padding: 0px;
}
</style>
