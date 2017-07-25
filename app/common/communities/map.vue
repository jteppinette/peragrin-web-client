<template>
<div class="community-map">

  <div class="floater" v-if="showFilter">
  <v-card>
    <v-toolbar floating dense class="elevation-0">
      <v-text-field v-model="filter.name" prepend-icon="search" solo class="elevation-0"></v-text-field>
      <v-btn icon @click.native="filter.name = filter.category = ''; results = true"><v-icon>close</v-icon></v-btn>
      <v-btn icon @click.native="community.zoom++"><v-icon>add</v-icon></v-btn>
      <v-btn icon @click.native="community.zoom--"><v-icon>remove</v-icon></v-btn>
    </v-toolbar>

    <v-card-text fluid class="grey lighten-4 categories">
      <v-btn :ripple="false" flat v-for="category in categories" :icon="filter.category != category.name" @click.native="filter.category = filter.category == category.name ? '' : category.name" :key="category.name"><v-icon :left="filter.category == category.name" :class="{'primary--text': filter.category == category.name}">{{ category.icon }}</v-icon>{{ filter.category == category.name ? category.name : '' }}</v-btn>
    </v-card-text>

    <v-list v-if="filter.name || filter.category" class="elevation-0">
      <v-subheader>{{ filtered.length }} results found <v-spacer></v-spacer><v-btn @click.native="results = !results" flat>{{ results ? 'collapse' : 'show' }}<v-icon right>{{ results ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn></v-subheader>
      <v-list-tile v-if="results" @click.native="focus(organization)" v-for="organization in filtered" :key="organization.id">
        <v-list-tile-content>{{ organization.name }}</v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
  </div>

  <v-map v-if="community.geoJSONOverlays" :zoom="community.zoom" :center="latlng" v-on:l-zoomend="({target: {_zoom: v}}) => community.zoom = v">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="organization in filtered" @l-click="({originalEvent: e}) => select(organization, e)" :key="organization.id" :icon="organization.icon" v-if="organization" :lat-lng="[organization.lat, organization.lon]"></v-marker>
    <v-geojson-layer v-for="overlay in community.geoJSONOverlays" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
  </v-map>

</div>
</template>

<script>
import {CATEGORIES, MARKERS} from 'common/categories';

function options({style}) {
  return {style: f => style.values ? {...style.values[f.properties[style.property]], ...style.base} : style.base};
};

export default {
  props: {'community': {}, 'showFilter': {default: false}},
  data: () => ({results: true, options, latlng: undefined, filter: {}, categories: CATEGORIES, zoom: undefined}),
  mounted: initialize,
  computed: {
    filtered () {
      let organizations = this.community.organizations || [];
      if (this.filter.category) organizations = organizations.filter(o => o.category == this.filter.category);
      if (this.filter.name) organizations = organizations.filter(o => o.name.toLowerCase().includes(this.filter.name.toLowerCase()));
      return organizations;
    }
  },
  methods: {select, focus, initializeGeoJSONOverlays, initializeOrganizations}
};

function initialize() {
  this.filter = {name: '', category: ''};
  this.zoom = this.community.zoom;
  this.latlng = [this.community.lat, this.community.lon];
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

function select(organization, e) {
  this.latlng = [organization.lat, organization.lon];
  if (e) e.stopPropagation();
  this.$emit('select', organization);
}

function focus(organization) {
  this.filter.name = organization.name
  this.results = false

  setTimeout(() => this.community.zoom = this.zoom, 0);
  setTimeout(() => this.latlng = [organization.lat, organization.lon], 500);
  setTimeout(() => this.community.zoom = this.zoom + 3, 1000);
}
</script>

<style lang="stylus">
.community-map {

  .leaflet-control-container {
    display: none;
  }

  .floater {
    top: 56px;
    z-index: 5;
    position: fixed;
    background-color: rgba(0, 0, 0, 0);
    padding: 16px;
    max-width: 100%;
    width: 400px;
  }

  .card {
    .categories {
      position: relative;
      overflow-x: scroll;
      white-space: nowrap;
      padding: 0px;

      .btn, .btn__content, .btn__content:before {
        -moz-transition: none;
        -webkit-transition: none;
        -o-transition: color 0 ease-in;
        transition: none;
      }
    }

    .list {
      overflow: scroll !important;
      max-height: 300px;
    }

    .toolbar {
      margin: 0px;
      width: 100%;

      .toolbar__content {
        width: 100%;
      }
    }
  }
}
</style>
