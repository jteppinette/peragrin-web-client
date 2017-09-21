<template>
<v-dialog v-model="value" width="800px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">Add Community</v-card-title>
    <form @submit.prevent="add" novalidate>

      <v-card-text>
        <v-subheader v-if="communities.length" class="pa-0 pt-2" style="height: 0px">Community</v-subheader>
        <v-select v-if="communities.length" return-object :items="communities" v-model="data" itemText="name" itemValue="id" label="Community" single-line></v-select>

        <v-checkbox v-if="account && account.isSuper" label="Is Community Administrator?" v-model="isAdministrator"></v-checkbox>
      </v-card-text>

      <v-map v-if="data.lon && data.lat" :zoom="data.zoom" :center="[data.lat, data.lon]">
        <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
        <v-marker :icon="icon" :lat-lng="{'lat': data.lat, 'lng': data.lon}"></v-marker>
      </v-map>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">Add</v-btn>
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

export default {
  props: ['organizationID', 'value'],
  data: () => ({icon: MARKERS['Community Leader'], submitting: false, msg: '', error: false, data: {}, communities: [], isAdministrator: false}),
  methods: {initialize, initializeCommunities, add},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  }
};

function initialize() {
  this.submitting = false;
  this.msg = '';
  this.data = {};
  return this.initializeCommunities();
}

function initializeCommunities() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities);
}

function add() {
  this.submitting = true;
  return this.$http.post(`/organizations/${this.organizationID}/communities/${this.data.id}`, {isAdministrator: this.isAdministrator})
    .then(({data: account}) => this.$emit('success'))
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
