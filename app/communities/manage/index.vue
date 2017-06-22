<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Communities</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap>
    <v-flex xs12 md6 v-for="community in communities" :key="community.id" v-if="community">
      <v-card>
        <v-card-title class="primary">
          <router-link :to="`/communities/${community.id}`" class="white--text">{{ community.name }}</router-link>
        </v-card-title>
        <v-map v-if="geoJSONOverlays[community.id] && community.lat && community.lon" :zoom="community.zoom" :center="[community.lat, community.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :lat-lng="{'lat': community.lat, 'lng': community.lon}"></v-marker>
          <v-geojson-layer v-for="overlay in geoJSONOverlays[community.id]" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
        </v-map>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import L from 'leaflet';

function options({style, options}) {
  return {style: f => style.values ? {...style.values[f.properties[style.property]], ...style.base} : style.base};
};

export default {
  data: () => ({geoJSONOverlays: {}, options}),
  computed: {
    account () {
      return this.$store.state.account;
    },
    communities () {
      if (!this.account || !this.account.organizations || !this.account.organizations.length) return undefined;
      var l = [];
      for (let i in this.account.organizations) {
        let organization = this.account.organizations[i];
        if (!organization.communities) return l;
        l = l.concat(organization.communities);
      }
      initializeGeoJSONOverlays.call(this, l);
      return l;
    }
  },
  mounted () {
    return this.$store.dispatch('initialize');
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function initializeGeoJSONOverlays(communities) {
  for (let i in communities) {
    if (!communities[i]) continue;
    this.$http.get(`/communities/${communities[i].id}/geo-json-overlays`)
      .then(response => response.json())
      .then(response => this.$set(this.geoJSONOverlays, communities[i].id, response));
  }
}
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 300px;
}
</style>
