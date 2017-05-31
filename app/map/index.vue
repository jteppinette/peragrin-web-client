<template>
<div>

  <!-- ORGANIZATION DRAWER -->
  <v-navigation-drawer v-model="sidebar" :hide-overlay="true" temporary right light class="organization-drawer">
    <div class="sticky-container">
      <organization-card :promotions="promotions[selected.id]" :disable-map="true" :organization="selected" :hours="hours[selected.id]" class="organization-card"></organization-card>
      <div class="hidden-sm-and-up back">
        <v-btn @click.native="sidebar = false" block light primary>
          <v-icon light>chevron_left</v-icon> Back
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>

  <!-- MAP -->
  <v-map v-if="loaded && lat && lon" :zoom="14" :center="[lat, lon]">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="organization in organizations" @l-click="(e) => select(e, organization)" :key="organization.id" :icon="organization.icon" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}"></v-marker>
    <v-geojson-layer :options="options" :geojson="geoJSON"></v-geojson-layer>
  </v-map>

</div>
</template>

<script>
import {WEEKDAYS, to12hr} from 'common/time';
import organizationCard from 'common/organization/card';
import L from 'leaflet';

var base = {
  weight: 2,
  color: 'white',
  opacity: 1,
  fillOpacity: .7
};

var options = {
  style: function (feature) {
    switch (feature.properties.BPA_Segmen) {
        case 'Northside': return {...base, fillColor: "#00aef4"};
        case 'Northeast': return {...base, fillColor: "#8bc932"};
        case 'Southeast': return {...base, fillColor: "#0061c2"};
        case 'Southwest': return {...base, fillColor: "#8bc932"};
        case 'Westside': return {...base, fillColor: "#0061c2"};
    }
  }
};

export default {
  data: () => ({loaded: false, options, geoJSON: undefined, weekdays: WEEKDAYS, organizations: [], hours: {}, selected: {}, promotions: {}, lon: 0, lat: 0, sidebar: false}),
  mounted,
  methods: {
    select: function({originalEvent: e}, organization) {
      this.selected = organization;
      this.sidebar = true;
      e.stopPropagation();
    }
  },
  filters: {
    'to12hr': value => to12hr(value)
  },
  watch: {
    selected: function(v) {
      this.lon = v.lon;
      this.lat = v.lat;
      this.$http.get(`/organizations/${v.id}/hours`)
        .then(response => response.json())
        .then(hours => this.$set(this.hours, v.id, hours));
      this.$http.get(`/organizations/${v.id}/promotions`)
        .then(response => response.json())
        .then(promotions => this.$set(this.promotions, v.id, promotions));
    }
  },
  components: {
    organizationCard
  }
};

function mounted() {
  this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.communities = communities)
    .then((communities) => {
      if (communities[0].geoJSON) {
        this.$http.get(communities[0].geoJSON)
          .then(response => response.json())
          .then(geoJSON => this.geoJSON = geoJSON)
          .then(() => this.loaded = true);
      } else {
        this.loaded = true;
      }
      return this.$http.get(`/communities/${communities[0].id}/organizations`)
        .then(response => response.json())
        .then(organizations => organizations.map(o => {
          if (o.category == 'Resturaunt') {
            return {...o, icon: L.icon({
              iconUrl:       require('../../assets/markers/resturaunt.png'),
              iconRetinaUrl: require('../../assets/markers/resturaunt.png'),
              shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
              iconSize:    [25, 41],
              iconAnchor:  [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize:  [41, 41]
            })};
          }
          if (o.icon && o.isAdministrator) {
            return {...o, icon: L.icon({iconUrl: o.icon, iconRetinaUrl: o.icon, iconSize: [64, 64], iconAnchor: [32, 32]})};
          }
          return o;
        }))
        .then(organizations => this.organizations = organizations)
        .then(organizations => this.selected = organizations[0]);
    });
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
      padding-top: 16px;
      position: absolute;
      bottom: 0px;
      width: 100%;
      background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 29%, rgba(255,255,255,1) 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 29%,rgba(255,255,255,1) 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 29%,rgba(255,255,255,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

      .btn {
        margin: 0px;
      }
    }
  }
}
</style>
