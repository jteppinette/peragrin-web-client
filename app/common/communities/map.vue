<template>
<div class="community-map">

  <v-container fluid class="pl-2 pr-2 pt-2 pb-1 elevation-1 grey lighten-4 categories" v-if="showFilter">
    <v-btn :ripple="false" flat v-for="category in categories" class="hidden-sm-and-down" @click.native="filter.category = filter.category == category.name ? '' : category.name; filter.name = ''" :key="category.name"><v-icon left :class="{'primary--text': filter.category == category.name}">{{ category.icon }}</v-icon> {{ category.name }}</v-btn>
    <v-btn :ripple="false" flat v-for="category in categories" :icon="filter.category != category.name" class="hidden-md-and-up" @click.native="filter.category = filter.category == category.name ? '' : category.name; filter.name = ''" :key="category.name"><v-icon :left="filter.category == category.name" :class="{'primary--text': filter.category == category.name}">{{ category.icon }}</v-icon>{{ filter.category == category.name ? category.name : '' }}</v-btn>
  </v-container>

  <div class="floater zoom hidden-xs-only" v-if="showFilter">
    <div class="grey elevation-1 lighten-4">
      <v-btn icon @click.native="community.zoom++" class="hidden-xs-only" v-tooltip:bottom="{html: 'zoom in'}"><v-icon>add</v-icon></v-btn>
      <v-btn icon @click.native="community.zoom--" class="hidden-xs-only" v-tooltip:bottom="{html: 'zoom out'}"><v-icon>remove</v-icon></v-btn>
    </div>
  </div>

  <div class="floater filter" v-if="showFilter">
    <v-card>
      <v-divider></v-divider>

      <v-toolbar floating dense class="elevation-0">
        <v-text-field v-model="filter.name" solo class="elevation-0" prepend-icon="search"></v-text-field>
        <div class="hidden-xs-only">
          <v-btn icon v-if="filter.name" @click.native="filter.name = ''" v-tooltip:bottom="{html: 'clear search'}"><v-icon>close</v-icon></v-btn>
          <v-btn @click.native="results = !results" flat icon :disabled="!filtered.length && !results" v-tooltip:bottom="{html: results ? 'collapse results' : 'expand results'}"><v-icon v-badge="{value: filtered.length, right: true}">{{ results ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
        </div>
        <div class="hidden-sm-and-up">
          <v-btn v-if="filter.name" icon @click.native="filter.name = ''"><v-icon>close</v-icon></v-btn>
          <v-btn @click.native="results = !results" flat icon :disabled="!filtered.length && !results"><v-icon v-badge="{value: filtered.length, right: true}">{{ results ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
        </div>
      </v-toolbar>

      <v-list v-if="results" class="elevation-0">
        <v-list-tile v-if="results" @click.native="focus(organization)" v-for="organization in filtered" :key="organization.id">
          <v-list-tile-content>{{ organization.name }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </div>

  <v-map v-if="community.geoJSONOverlays" :zoom="community.zoom" :center="latlng" v-on:l-zoomend="({target: {_zoom: v}}) => community.zoom = v" :class="{'custom-controls': showFilter}">
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
  data: () => ({results: false, options, latlng: undefined, filter: {}, categories: CATEGORIES, zoom: undefined}),
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
@import '../../../settings';

.community-map {

  .custom-controls .leaflet-control-container {
    display: none;
  }

  .categories {
    position: fixed;
    overflow-x: scroll;
    white-space: nowrap;
    z-index: 2;

    .btn, .btn__content, .btn__content:before {
      -moz-transition: none;
      -webkit-transition: none;
      -o-transition: color 0 ease-in;
      transition: none;
    }
  }

  .floater {
    top: 108px;
    z-index: 2;
    position: fixed;
    background-color: rgba(0, 0, 0, 0);
    padding: 16px;


    &.filter {
      max-width: 100%;
      width: 500px;

      @media screen and (max-width: 599px) {
        padding: 0px;
        max-width: 100%;
        width: 599px;
      }
    }


    &.zoom {
      right: 0px; width: inherit
      .btn {
        margin: 14px 4px !important;
      }
    }

    .card {
      @media screen and (max-width: 599px) {
        border-radius: 0px !important;
        box-shadow: 0 0px 0px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
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
          margin-right: 16px !important;
        }
      }
    }
  }

  .btn {
    margin: 6px 4px !important;
  }
}
</style>
