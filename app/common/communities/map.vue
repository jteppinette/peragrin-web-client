<template>
<v-map v-if="geoJSONOverlays" :zoom="community.zoom" :center="[community.lat, community.lon]">
  <v-tilelayer :url="URL"></v-tilelayer>
  <v-marker v-for="organization in organizations" :key="organization.id" :icon="organization.icon" v-if="organization" :lat-lng="[organization.lat, organization.lon]"></v-marker>
  <v-geojson-layer v-for="overlay in geoJSONOverlays" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
</v-map>
</template>

<script>
import {MARKERS} from 'common/categories';
import {URL} from 'common/map';

function options({style}) {
  return {style: f => style.values ? {...style.values[f.properties[style.property]], ...style.base} : style.base};
};

export default {
  props: ['community'],
  data: () => ({options, organizations: [], geoJSONOverlays: undefined, URL}),
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
    .then(({data: geoJSONOverlays}) => this.geoJSONOverlays = geoJSONOverlays);
}

function initializeOrganizations() {
  return this.$http.get(`/communities/${this.community.id}/organizations`)
    .then(({data: organizations}) => organizations.map(o => ({...o, icon: MARKERS[o.category]})))
    .then(organizations => this.organizations = organizations);
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  height: 300px;
}
</style>
