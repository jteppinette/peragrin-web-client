<template>
<div>
  <v-navigation-drawer v-model="sidebar" :hide-overlay="true" temporary right light class="organization-drawer">
    <v-card class="elevation-0">

      <v-card-row class="primary">
        <v-card-title class="white--text">
          <span>
            <v-btn @click.native="sidebar = false" light icon class="hidden-sm-and-up"><v-icon large>chevron_left</v-icon></v-btn>
            {{ selected.name }}
          </span>
        </v-card-title>

      </v-card-row>
      <v-card-row class="primary" v-if="selected.category">
        <v-card-text class="category-chip"><v-chip outline class="white--text">{{ selected.category }}</v-chip></v-card-text>
      </v-card-row>
      <v-card-row v-if="selected.logo" :img="selected.logo" height="130px"></v-card-row>

      <v-tabs scroll-bars v-model="active" light class="tabs-no-border">

        <!-- BAR -->
        <v-tabs-bar slot="activators">
          <v-tabs-item ripple href="#general">General</v-tabs-item>
          <v-tabs-item ripple href="#promotions" v-if="selected.promotions && selected.promotions.length">Promotions</v-tabs-item>
        </v-tabs-bar>

        <!-- GENERAL -->
        <v-tabs-content id="general"><organization-details :organization="selected"></organization-details></v-tabs-content>

        <!-- PROMOTIONS -->
        <v-tabs-content id="promotions">
          <v-expansion-panel class="elevation-0">
            <v-expansion-panel-content v-for="promotion in selected.promotions" :key="promotion.name">
              <div slot="header"><strong>{{ promotion.name }}</strong><br/><small>{{ promotion.description }}</small></div>
              <v-card>
                <v-card-row v-if="promotion.expiration" class="mb-3">
                  <v-icon class="ml-2 mr-4" dark>timer</v-icon>
                  <div>
                    <div><strong>Expiration</strong></div>{{ promotion.expiration | moment("from", true) }}
                  </div>
                </v-card-row>
                <v-card-row v-if="promotion.exclusions" class="mb-3">
                  <v-icon class="ml-2 mr-4" dark>warning</v-icon>
                  <div>
                    <div><strong>Exclusions</strong></div>{{ promotion.exclusions }}
                  </div>
                </v-card-row>
                <v-card-row v-if="promotion.isSingleUse">
                  <v-container fluid>
                    <strong>This promotion can only be redeemed once.</strong>
                  </v-container>
                </v-card-row>
                <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
                <v-card-row actions>
                  <v-btn default block :disabled="promotion.redeemed || error" @click.native="redeem(promotion)">{{ promotion.redeemed ? 'Redeemed' : 'Redeem' }}</v-btn>
                </v-card-row>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-tabs-content>

      </v-tabs>

    </v-card>
  </v-navigation-drawer>
  <v-map v-if="geoJSONOverlays && latlng && zoom" :zoom="zoom" :center="latlng" v-on:l-zoomend="({target: {_zoom: v}}) => zoom = v">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="organization in organizations" @l-click="({originalEvent: e}) => select(organization, e)" :key="organization.id" :icon="organization.icon" :lat-lng="[organization.lat, organization.lon]"></v-marker>
    <v-geojson-layer v-for="overlay in geoJSONOverlays" :key="overlay.name" :options="options(overlay)" :geojson="overlay.data"></v-geojson-layer>
  </v-map>
</div>
</template>

<script>
import organizationDetails from 'common/organization/details';
import L from 'leaflet';

function options({style}) {
  return {style: f => style.values ? {...style.values[f.properties[style.property]], ...style.base} : style.base};
};

export default {
  data: () => ({active: undefined, zoom: 0, options, geoJSONOverlays: undefined, community: undefined, organizations: undefined, selected: {}, latlng: undefined, sidebar: false, msg: '', error: undefined}),
  mounted,
  methods: {select, redeem},
  components: {organizationDetails}
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
const MARKERS = ['Restaurant', 'Entertainment', 'Retail', 'Organization', 'Service', 'Realestate', 'Health', 'Community Leader'].reduce((result, key) => {
  result[key] = L.icon({...MARKER_BASE, iconUrl: require(`../../assets/markers/${key.toLowerCase().replace(' ', '-')}.png`)});
  return result;
}, {});

function initializeOrganizations(communityID) {
  return this.$http.get(`/communities/${communityID}/organizations`)
    .then(response => response.json())
    .then(organizations => this.organizations = organizations.map(o => ({...o, icon: MARKERS[o.category]})))
}

function select(organization, e) {
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

function redeem(promotion) {
  return this.$http.post(`/promotions/${promotion.id}/redeem`)
    .then(() => this.$set(promotion, 'redeemed', true))
    .catch(({data, status}) => {
      this.error = true;
      if (status == 401) {
        this.msg = 'you must login to access this peragrin feature';
      } else if (data && data.msg) {
        this.msg = data.msg;
      } else {
        this.msg = 'unknown error';
      }
    });
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  position: fixed;
  height: 100% !important;
  top: 56px;
  z-index: 1;
}
</style>

<style lang="stylus">
.organization-drawer {
  border: 0;
  padding: 0px;

  &.navigation-drawer--open {
    width: 400px;
    max-width: 90vw;
  }

  .expansion-panel__header {
    min-height: 60px;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: inherit;
  }

  .tabs-no-border {
    .tabs__items {
      border-style: none;
    }
  }
}
</style>
