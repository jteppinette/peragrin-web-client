<template>
<v-app>
  <v-navigation-drawer v-model="navbar" :mini-variant.sync="mini" clipped persistent light>

    <v-list v-if="email">
      <v-list-item>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <v-gravatar :email="email" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ email }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon dark @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-item>
    </v-list> 

    <v-list>
      <v-divider></v-divider>
      <v-list-item v-if="!email">
        <v-list-tile :router="true" href="/auth/login">
          <v-list-tile-action><v-icon>lock_open</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Login</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item>
        <v-list-tile :router="true" href="/client">
          <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Map</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

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

  <v-toolbar class="primary elevation-0" fixed>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="navbar = !navbar" light></v-toolbar-side-icon>
    <v-toolbar-title>peragrin</v-toolbar-title>
    <v-toolbar-items class="hidden-md-and-down">
      <v-toolbar-item v-if="!email" :router="true" href="/auth/login" ripple>Login</v-toolbar-item>
    </v-toolbar-items>
    <v-menu v-if="email" bottom origin="top right" transition="v-scale-transition">
      <v-btn light icon slot="activator"><v-icon>account_circle</v-icon></v-btn>
      <v-list>
        <v-list-item>
          <v-list-tile><v-list-tile-title>View Profile</v-list-tile-title></v-list-tile>
          <v-list-tile><v-list-tile-title>Settings</v-list-tile-title></v-list-tile>
          <v-list-tile @click.native="logout"><v-list-tile-title>Log Out</v-list-tile-title></v-list-tile>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-toolbar>
  <main>
    <v-map v-if="lat && lon" :zoom="14" :center="[lat, lon]">
      <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
      <v-marker v-for="organization in organizations" @l-click="(e) => select(e, organization)" :key="organization.id" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
        <v-popup :content="organization.name"></v-popup>
      </v-marker>
    </v-map>
  </main>
</v-app>
</template>

<script>
import {WEEKDAYS, to12hr} from 'common/time';
import organizationCard from 'common/organization/card';

export default {
  data: () => ({email: sessionStorage.email, navbar: true, mini: true, weekdays: WEEKDAYS, organizations: [], hours: {}, selected: {}, promotions: {}, lon: 0, lat: 0, sidebar: false}),
  mounted,
  methods: {
    select: function({originalEvent: e}, organization) {
      this.selected = organization;
      this.sidebar = true;
      e.stopPropagation();
    },
    logout: function() {
      sessionStorage.clear();
      this.email = undefined;
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
      return this.$http.get(`/communities/${communities[0].id}/organizations`)
        .then(response => response.json())
        .then(organizations => this.organizations = organizations)
        .then(organizations => this.selected = organizations[0]);
    });
}
</script>

<style scoped lang="stylus">
.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
}

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
