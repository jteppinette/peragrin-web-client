<template>
  <v-card>

    <v-card-title class="primary white--text">{{ organization.name || 'Your Organization' }}</v-card-title>

    <v-subheader>General</v-subheader>
    <v-card-row>
      <v-card-text>
        <strong>{{ organization.name }}</strong>
      </v-card-text>
    </v-card-row>

    <v-divider></v-divider>

    <v-subheader>Address</v-subheader>
    <v-card-row>
      <v-card-text>
        <blockquote>
          {{ organization.street }} <br/>
          {{ organization.city }} {{ organization.state }} {{ organization.zip }} <br/>
          {{ organization.country }}
        </blockquote>
      </v-card-text>
    </v-card-row>

    <v-card-row v-if="organization.lon && organization.lat">
      <v-map v-if="organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
        <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
        <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
           <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
    </v-card-row>

  </v-card>
</template>

<script>
export default {
  props: ['organization']
};
</script>

<style scoped lang="stylus">
$map-height := 400px;

.leaflet-container {
  z-index: 5;
  height: $map-height - 63 !important;
}
</style>
