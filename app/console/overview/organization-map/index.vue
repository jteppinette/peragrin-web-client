<template>
  <v-map v-if="organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
    <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
    <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
       <v-popup :content="organization.name"></v-popup>
    </v-marker>
  </v-map>

</template>

<script>

export default {
  props: ['organization']
};
</script>

<style lang="stylus">
$map-height := 400px;

.leaflet-container {
  z-index: 5;
  height: $map-height - 63 !important;
}
</style>
