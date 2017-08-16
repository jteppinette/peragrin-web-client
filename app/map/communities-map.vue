<template>
<div v-if="initialized">

  <div class="communities">
    <v-card v-for="c in communities" v-if="c" :key="c.id" :class="{'elevation-10': c.id == community.id, 'elevation-2': c.id != community.id}">
      <v-card-title @click="() => community = c" class="subheading" :class="{'secondary': c.id != community.id, 'primary': c.id == community.id}">{{ c.name }}</v-card-title>
      <v-list v-if="c.distance" :dense="true">
        <v-list-tile>
          <v-list-tile-action><v-icon>directions</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>~{{ c.distance }} mi away</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-card-actions class="secondary">
        <v-btn flat class="white--text" @click.native="() => community = c">Fly Over</v-btn>
        <v-btn outline class="white--text" :to="`/map?community=${c.name}`">View Map</v-btn>
      </v-card-actions>
    </v-card>
  </div>

  <v-map ref="map" :zoom="zoom" :center="latlng" v-on:l-zoomend="({target: {_zoom: v}}) => zoom = v" class="control-right">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="c in communities" :icon="c.id == community.id ? icons.active : icons.cl" @l-click="() => community = c" :key="c.id" v-if="c" :lat-lng="[c.lat, c.lon]">
      <v-tooltip :content="c.name"></v-tooltip>
    </v-marker>
    <v-marker v-if="self" :icon="icons.self" :lat-lng="self">
      <v-tooltip content="you"></v-tooltip>
    </v-marker>
  </v-map>

</div>
</template>

<script>
import {MARKERS, ACTIVE_COMMUNITY, SELF} from 'common/categories';

let icons = {
  cl: MARKERS['Community Leader'],
  active: ACTIVE_COMMUNITY,
  self: SELF
};

export default {
  props: ['communities', 'self'],
  data: () => ({initialized: false, community: undefined, latlng: [], zoom: 11, icons}),
  mounted: initialize,
  watch: {
    community (v) {
     this.latlng = [this.community.lat, this.community.lon];
    }
  }
};

function initialize() {
  this.community = this.communities[0];
  this.latlng = [this.community.lat, this.community.lon];
  this.initialized = true;
}
</script>

<style scoped lang="stylus">
@import '../../settings';

.vue2leaflet-map {
  position: fixed;
  height: 100% !important;
  z-index: 1;
  top: 53px;
}

.communities {
  z-index: 3;
  position: fixed;
  bottom: 0px;
  white-space: nowrap;
  width: 100%;
  max-height: 250px;
  overflow-x: scroll;

  @media screen and (min-width: 600px) {
    padding-right: 300px;
  }

  .card {
    display: inline-block;
    margin: 10px;

    .card__title {
      cursor: pointer;
    }
  }
}
</style>
