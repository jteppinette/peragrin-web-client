<template>
<div>
  <v-navigation-drawer v-model="sidebar" :hide-overlay="true" temporary right light class="organization-drawer">
    <div class="sticky-container">
      <organization-card :promotions="selected.promotions" :disable-map="true" :organization="selected" :hours="selected.hours" class="organization-card"></organization-card>
      <div class="hidden-sm-and-up back">
        <v-btn @click.native="sidebar = false" block light primary><v-icon light>chevron_left</v-icon> Back</v-btn>
      </div>
    </div>
  </v-navigation-drawer>
  <v-map v-if="geoJSONOverlays && latlng && zoom" :zoom="zoom" :center="latlng" v-on:l-zoomend="({target: {_zoom: v}}) => zoom = v">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="organization in organizations" @l-click="({originalEvent: e}) => select(organization, e)" :key="organization.id" :icon="organization.icon" :lat-lng="[organization.lat, organization.lon]"></v-marker>
    <v-geojson-layer v-for="overlay in geoJSONOverlays" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
  </v-map>
</div>
</template>

<script>
import organizationCard from 'common/organization/card';
import L from 'leaflet';

function options({style}) {
  return {style: f => ({...style.values[f.properties[style.property]], ...style.base})};
};

export default {
  data: () => ({zoom: 0, options, geoJSONOverlays: undefined, community: undefined, organizations: undefined, selected: {}, latlng: undefined, sidebar: false}),
  mounted,
  methods: {
    select: function(organization, e) {
      this.latlng = [organization.lat, organization.lon];
      if (e) e.stopPropagation();
      var hours = organization.hours ? organization.hours : this.$http.get(`/organizations/${organization.id}/hours`).then(response => response.json());
      var promotions = organization.promotions ? organization.promotions : this.$http.get(`/organizations/${organization.id}/promotions`).then(response => response.json());
      return Promise.all([hours, promotions]).then(values => {
        this.$set(organization, 'hours', values[0]);
        this.$set(organization, 'promotions', values[1]);
        this.selected = organization;
        this.sidebar = true;
      });
    }
  },
  components: {
    organizationCard
  }
};

function mounted() {
  this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.community = communities[0])
    .then(community => {
      this.latlng = [community.lat, community.lon];
      this.zoom = community.zoom;
      return Promise.all([
        initializeOrganizations.call(this, community.id),
        initializeGeoJSONOverlays.call(this, community.id)
      ]);
    });
}

function initializeGeoJSONOverlays(communityID) {
  return this.$http.get(`/communities/${communityID}/geo-json-overlays`)
    .then(response => response.json())
    .then(geoJSONOverlays => this.geoJSONOverlays = geoJSONOverlays);
}

const MARKER_BASE = {
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
};
const RESTURAUNT = 'Resturaunt';
const MARKERS = {
  [RESTURAUNT]: L.icon({...MARKER_BASE,
    iconUrl:       require('../../assets/markers/resturaunt.png'),
    iconRetinaUrl: require('../../assets/markers/resturaunt.png'),
  })
};

function initializeOrganizations(communityID) {
  return this.$http.get(`/communities/${communityID}/organizations`)
    .then(response => response.json())
    .then(organizations => organizations.map(o => {
      if (o.category == RESTURAUNT) return {...o, icon: MARKERS[RESTURAUNT]};
      if (o.icon && o.isAdministrator) return {...o, icon: L.icon({iconUrl: o.icon, iconSize: [64, 64], iconAnchor: [32, 32]})};
      return o;
    }))
    .then(organizations => this.organizations = organizations);
}
</script>

<style scoped lang="stylus">
@import '../../settings';

.vue2leaflet-map {
  position: fixed;
  height: 100% !important;
  top: 56px;
  z-index: 1;
}

.organization-drawer {
  border: 0;
  padding: 0px;

  &.navigation-drawer--open {
    width: 400px;
    max-width: 90vw;
  }

  .sticky-container {
    position: relative;
    height: 100%;

    .organization-card {
      overflow: scroll !important;
      height: 100% !important;

      @media screen and (max-width: $grid-breakpoints.sm) {
        padding-bottom: 40px;
      }
    }

    .back {
      padding: 8px;
      position: absolute;
      bottom: 0px;
      width: 100%;
      background-color: white;

      .btn {
        margin: 0px;
      }
    }
  }
}
</style>
