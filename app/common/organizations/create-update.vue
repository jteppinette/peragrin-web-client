<template>
<v-dialog v-model="value" width="800px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">{{ action.name }} Organization</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <organizations-form v-model="data"></organizations-form>

        <p v-if="data.lon && data.lat">If necessary, move the marker to adjust the organization's icon location on the map.</p>
        <v-map v-if="value && data.lon && data.lat" :zoom="15" :center="[data.lat, data.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker v-on:l-move="move" :icon="icon" :lat-lng="{'lat': data.lat, 'lng': data.lon}" draggable></v-marker>
        </v-map>

        <organizations-hours v-model="data.hours"></organizations-hours>
      </v-card-text>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click.native="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :disabled="!data.lon || !data.lat" :loading="submitting" type="submit">{{ action.name }}</v-btn>
      </v-card-actions>

      <v-snackbar v-if="value" v-model="error" error>{{ msg }}
        <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
      </v-snackbar>

    </form>
  </v-card>
</v-dialog>
</template>
<script>
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';
import {MARKERS} from 'common/categories';
import _ from 'lodash';

export default {
  props: ['organization', 'communityID', 'value'],
  data: () => ({submitting: false, msg: '', error: false, action: {}, data: {}}),
  components: {organizationsForm, organizationsHours},
  computed: {
    icon () {
      return this.data.category ? MARKERS[this.data.category] : undefined;
    }
  },
  methods: {create, update, move: _.debounce(move, 500)},
  mounted: initialize
};

function initialize() {
  this.action = this.organization ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
  this.data = this.organization ? JSON.parse(JSON.stringify(this.organization)) : {
    name: '',
    street: '',
    city: '',
    state: 'GA',
    country: 'US',
    zip: '',
    lon: 0,
    lat: 0,
    email: '',
    phone: '',
    website: '',
    hours: [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}],
    category: ''
  };
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
    .then(({data: organization}) => this.$emit('created', organization))
    .then(() => this.$emit('input', false))
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
