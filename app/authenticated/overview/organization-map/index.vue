<template>
  <v-map :zoom=15 :center="[organization.latitude, organization.longitude]">
    <v-tilelayer :token="mapboxAPIKey" url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={token}"></v-tilelayer>
    <v-marker :lat-lng="{'lat': organization.latitude, 'lng': organization.longitude}">
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
  data: () => ({mapboxAPIKey: sessionStorage.mapboxAPIKey}),
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
