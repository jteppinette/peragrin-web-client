<template>
<v-map v-if="community.geoJSONOverlays" :zoom="community.zoom" :center="[this.community.lat, this.community.lon]">
  <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
  <v-marker v-for="organization in community.organizations" :key="organization.id" :icon="organization.icon" v-if="organization" :lat-lng="[organization.lat, organization.lon]"></v-marker>
  <v-geojson-layer v-for="overlay in community.geoJSONOverlays" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
</v-map>
</template>

<script>
import {CATEGORIES, MARKERS} from 'common/categories';

function options({style}) {
  return {style: f => style.values ? {...style.values[f.properties[style.property]], ...style.base} : style.base};
};

export default {
  props: ['community'],
  data: () => ({options, categories: CATEGORIES}),
  mounted: initialize,
  methods: {initializeGeoJSONOverlays, initializeOrganizations}
};

function initialize() {
  return Promise.all([
    this.initializeOrganizations(),
    this.initializeGeoJSONOverlays()
  ]);
}

function initializeGeoJSONOverlays() {
  return this.$http.get(`/communities/${this.community.id}/geo-json-overlays`)
    .then(({data: geoJSONOverlays}) => this.$set(this.community, 'geoJSONOverlays', geoJSONOverlays));
}

function initializeOrganizations() {
  return this.$http.get(`/communities/${this.community.id}/organizations`)
    .then(({data: organizations}) => organizations.map(o => ({...o, icon: MARKERS[o.category]})))
    .then(organizations => this.$set(this.community, 'organizations', organizations));
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 300px;
}
</style>
