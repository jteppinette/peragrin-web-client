<template>
<v-dialog v-model="value" width="800px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">{{ action.name }} Community</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <v-text-field v-model="data.name" type="text" label="Name"></v-text-field>
      </v-card-text>

      <v-card-text class="secondary">
        <p>Use the map marker and zoom controls to set the initial center point and zoom level for your community map. This should be set so that <strong>all businesses in your community are visible at that zoom level and the marker is at the center focal point of your community</strong>. e.g. a city marker or court house</p>
      </v-card-text>

      <v-map v-if="value && data.lon && data.lat" :zoom="data.zoom" :center="[data.lat, data.lon]" @l-zoomend="({target: {_zoom: v}}) => data.zoom = v">
        <v-tilelayer :url="URL"></v-tilelayer>
        <v-marker v-on:l-move="move" :icon="icon" :lat-lng="{'lat': data.lat, 'lng': data.lon}" draggable></v-marker>
      </v-map>

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
import {MARKERS} from 'common/categories';
import {STATES} from 'common/geo';
import {URL} from 'common/map';
import _ from 'lodash';

export default {
  props: ['community', 'value'],
  data: () => ({icon: MARKERS['Community Leader'], submitting: false, msg: '', error: false, data: {}, URL}),
  methods: {initialize, create, update, move: _.debounce(move, 500)},
  computed: {
    action () {
      return this.community ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    }
  },
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  }
};

function initialize() {
  let georgia = STATES.find(s => s.code == 'GA');
  this.submitting = false;
  this.msg = '';
  this.error = false;
  this.data = this.community ? JSON.parse(JSON.stringify(this.community)) : {
    name: '',
    lon: georgia.lon,
    lat: georgia.lat,
    zoom: 11
  };
}

function move({latlng}) {
  this.$set(this.data, 'lon', latlng.lng);
  this.$set(this.data, 'lat', latlng.lat);
}

function update() {
  this.submitting = true;
  return this.$http.put(`/communities/${this.community.id}`, this.data)
    .then(({data: community}) => this.$emit('updated', {...this.community, ...community}))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function create() {
  this.submitting = true;
  return this.$http.post('/communities', this.data)
    .then(({data: community}) => this.$emit('created', this.community = community))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 250px;
}
</style>
