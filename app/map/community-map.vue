<template>
<div :class="{'with-organization': organization}">

  <v-container fluid class="pl-2 pr-2 pt-2 pb-1 elevation-1 grey lighten-4 categories top">
    <v-btn :ripple="false" flat v-for="category in categories" class="hidden-sm-and-down" :class="{'btn--active': filter.category == category.name}" @click.native="filter.category = filter.category == category.name ? '' : category.name; clear()" :key="category.name"><v-icon left class="secondary--after" :class="{'white--text': filter.category == category.name}" v-badge="{value: 'close', icon: true, left: true, visible: filter.category == category.name}">{{ category.icon }}</v-icon> {{ category.name }}</v-btn>
    <v-btn flat v-for="category in categories" :icon="filter.category != category.name" class="hidden-md-and-up" :class="{'btn--active': filter.category == category.name}" @click.native="filter.category = filter.category == category.name ? '' : category.name; clear()" :key="category.name"><v-icon class="secondary--after" :left="filter.category == category.name" v-badge="{value: 'close', icon: true, left: true, visible: filter.category == category.name}" :class="{'white--text': filter.category == category.name}">{{ category.icon }}</v-icon>{{ filter.category == category.name ? category.name : '' }}</v-btn>
  </v-container>

  <div class="filter" :class="{top: organization, floater: !organization}">
    <v-card class="elevation-1">
      <v-divider></v-divider>

      <v-toolbar floating dense class="elevation-0">
        <v-text-field :disabled="!!organization" v-model="filter.name" solo class="elevation-0" prepend-icon="search"></v-text-field>
        <div class="hidden-xs-only">
          <v-btn icon v-if="organization || filter.name" @click.native="clear" v-tooltip:bottom="{html: 'clear search'}"><v-icon>close</v-icon></v-btn>
          <v-btn v-if="!organization" @click.native="results = !results" flat icon :disabled="!filtered.length && !results" v-tooltip:bottom="{html: results ? 'collapse results' : 'expand results'}"><v-icon v-badge="{value: filtered.length, right: true}">{{ results ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
        </div>
        <div class="hidden-sm-and-up">
          <v-btn v-if="organization || filter.name" icon @click.native="clear"><v-icon>close</v-icon></v-btn>
          <v-btn v-if="!organization" @click.native="results = !results" flat icon :disabled="!filtered.length && !results"><v-icon v-badge="{value: filtered.length, right: true}">{{ results ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon></v-btn>
        </div>
      </v-toolbar>

      <v-list v-if="results" class="elevation-0">
        <v-list-tile v-if="filter.category && results" @click.native="() => select(organization, true)" v-for="organization in filtered" :key="organization.id">
          <v-list-tile-content>{{ organization.name }}</v-list-tile-content>
        </v-list-tile>
        <template v-if="!filter.category && results" v-for="(organizations, category) in categorized">
          <v-subheader>{{ category }}</v-subheader>
          <v-list-tile @click.native="() => select(organization, true)" v-for="organization in organizations" :key="organization.id">
            <v-list-tile-content>{{ organization.name }}</v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>

      <organization-dropdown class="dropdown hidden-xs-only" v-if="organization" :organization="organization"></organization-dropdown>
    </v-card>
  </div>

  <v-map ref="map" v-if="community && community.geoJSONOverlays" :zoom="zoom" :center="latlng" v-on:l-zoomend="({target: {_zoom: v}}) => zoom = v" class="control-right">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="organization in filtered" @l-click="select(organization)" :key="organization.id" :icon="organization.icon" v-if="organization" :lat-lng="[organization.lat, organization.lon]"></v-marker>
    <v-geojson-layer v-for="overlay in community.geoJSONOverlays" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
  </v-map>

  <organization-dropdown class="bottom dropdown hidden-sm-and-up" v-if="organization" :organization="organization"></organization-dropdown>

</div>
</template>

<script>
import organizationDropdown from './organization-dropdown';
import {CATEGORIES, MARKERS} from 'common/categories';

export default {
  props: ['community'],
  data: () => ({initialized: false, icon: MARKERS['Community Leader'], results: false, filter: {}, latlng: undefined, categories: CATEGORIES, zoom: undefined, organization: undefined}),
  mounted: initialize,
  methods: {options, select, clear, initializeCommunity, initializeGeoJSONOverlays, initializeOrganizations},
  components: {organizationDropdown},
  computed: {
    filtered () {
      let organizations = this.community && this.community.organizations ? this.community.organizations : [];
      if (this.filter.category) organizations = organizations.filter(o => o.category == this.filter.category);
      if (this.filter.name) organizations = organizations.filter(o => o.name.toLowerCase().includes(this.filter.name.toLowerCase()));
      return organizations;
    },
    categorized () {
      return this.filtered.reduce((obj, elem) => {
        (obj[elem.category] = obj[elem.category] || []).push(elem);
        return obj;
      }, {});
    }
  },
  watch: {
    community (v) {
      this.organization = undefined;
      this.filter = {name: '', category: ''};
      return this.initializeCommunity(v);
    }
  }
};

function clear() {
  this.filter.name = '';
  this.organization = undefined;
  this.$refs.map.mapObject._size.y = window.innerHeight;
  this.$refs.map.mapObject.setView(this.latlng, this.zoom)

  setTimeout(() => {
    this.zoom = this.community.zoom
  }, 500);
  setTimeout(() => {
    this.latlng = [this.community.lat, this.community.lon];
  }, 1000);
}

function options({style}) {
  return {style: f => style.values ? {...style.values[f.properties[style.property]], ...style.base} : style.base};
};

function initialize() {
  this.filter = {name: '', category: ''};
  return this.initializeCommunity(this.community)
    .then(() => this.initialized = true);
}

function initializeCommunity(community) {
  this.zoom = this.community ? this.community.zoom : undefined;
  this.latlng = this.community ? [this.community.lat, this.community.lon] : [];
  return this.community ? Promise.all([this.initializeOrganizations(), this.initializeGeoJSONOverlays()]) : undefined;
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

function select(o, fly=false) {
  this.filter.name = o.name
  this.results = false

  if (fly && window.innerWidth > 599) { 
    setTimeout(() => this.zoom = this.community.zoom, 0);
    setTimeout(() => this.latlng = [o.lat, o.lon], 500);
    setTimeout(() => this.zoom = this.community.zoom + 3, 1000);
  } else {
    if (window.innerWidth <= 599) this.$refs.map.mapObject._size.y = 100;
    this.latlng = [o.lat, o.lon];
    if (fly) this.zoom = this.community.zoom + 3;
  }

  var hours = this.$http.get(`/organizations/${o.id}/hours`).then(response => response.data);
  var promotions = this.$http.get(`/organizations/${o.id}/promotions`).then(response => response.data);
  return Promise.all([hours, promotions])
    .then(values => this.organization = {...o, hours: values[0], promotions: values[1]})
}
</script>

<style lang="stylus">
@import '../../settings';

.bottom {
  z-index: 2;
  box-shadow: 0 2px 4px 2px rgba(0,0,0,.2), 0 4px 5px rgba(0,0,0,.14), 0 1px 10px rgba(0,0,0,.12)
  position: fixed;
  top: 217px;
  background-color: white;
  width: 100%;

  overflow-y: scroll;
  height: -moz-calc(100% - 217px);
  height: -webkit-calc(100% - 217px);
  height: -o-calc(100% - 217px);
  height: calc(100% - 217px);
}

.top {
  top: 53px;
  z-index: 2;
  position: fixed;

  &.filter {
    @media screen and (min-width: 600px) {
      top: 113px;
      background-color: rgba(0, 0, 0, 0);
      padding: 16px;
    }
  }
}

.floater {
  top: 113px;
  z-index: 2;
  position: fixed;

  background-color: rgba(0, 0, 0, 0);
  padding: 8px;

  @media screen and (max-width: 599px) {
    padding: 0px;
  }
}

.categories {
  overflow-x: scroll;
  white-space: nowrap;

  .btn, .btn__content, .btn__content:before {
    -moz-transition: none;
    -webkit-transition: none;
    -o-transition: color 0 ease-in;
    transition: none;
  }

  .btn.btn--active .btn__content:before, .btn:hover .btn__content:before {
    background-color: currentColor !important;
    opacity: .2 !important;
  }
}

.filter {
  max-width: 100%;
  width: 500px;

  .dropdown {
    overflow-y: scroll;
    max-height: -moz-calc(100vh - 209px);
    max-height: -webkit-calc(100vh - 209px);
    max-height: -o-calc(100vh - 209px);
    max-height: calc(100vh - 209px);
  }

  .list {
    overflow-y: scroll;
    max-height: 300px;

    @media screen and (max-width: 599px) {
      max-height: 100vh;
    }
  }

  @media screen and (max-width: 599px) {
    max-width: 100%;
    width: 599px;
  }

  .toolbar {
    margin: 0px;
    width: 100%;

    .toolbar__content {
      width: 100%;
      margin-right: 16px !important;
    }
  }

  .card {
    @media screen and (max-width: 599px) {
      border-radius: 0px !important;
      box-shadow: 0 0px 0px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
    }
  }
}

.btn {
  margin: 6px 4px !important;
}
</style>

<style scoped lang="stylus">
@import '../../settings';

.with-organization .vue2leaflet-map {
  @media screen and (max-width: 599px) {
    top: 117px !important;
    height: 100px !important;
  }
}

.vue2leaflet-map {
  position: fixed;
  height: 100% !important;
  z-index: 1;
  top: 113px;
  overflow: hidden;

  @media screen and (max-width: 599px) {
    top: 177px;
  }
}
</style>
