<template>
  <v-map :zoom=15 :center="[organization.lat, organization.lon]">
    <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
    <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
       <v-popup :content="organization.name"></v-popup>
    </v-marker>
  </v-map>
</template>

<script>
import L from 'leaflet';

L.Icon.Default.imagePath = '/';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

import Vue2Leaflet from 'vue2-leaflet';

export default {
  props: ['organization'],
  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-popup': Vue2Leaflet.Popup
  }
};
</script>

<style lang="stylus">
$map-height := 400px;

.leaflet-container {
  z-index: 5;
  height: $map-height - 63 !important;
}
</style>
