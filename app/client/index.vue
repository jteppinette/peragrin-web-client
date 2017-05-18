<template>
<v-app sidebar-under-toolbar top-toolbar right-fixed-sidebar class="client">
  <v-toolbar class="primary elevation-0" fixed>
    <v-toolbar-logo class="text-xs-right">peragrin</v-toolbar-logo>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="sidebar = !sidebar" />
    <v-toolbar-items class="hidden-md-and-down">
      <v-toolbar-item :router="true" href="/auth/login" ripple>Login</v-toolbar-item>
    </v-toolbar-items>
  </v-toolbar>
  <v-map v-if="lat && lon" :zoom="14" :center="[lat, lon]">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="organization in organizations" @l-click="(e) => select(e, organization)" :key="organization.id" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
      <v-popup :content="organization.name"></v-popup>
    </v-marker>
  </v-map>
  <v-sidebar v-model="sidebar" fixed right>

    <v-subheader>General</v-subheader>
    <v-container>
      <p><strong class="white--text">{{ selected.name }}</strong></p>
    </v-container>

    <v-subheader>Address</v-subheader>
    <blockquote style="color: white">
      {{ selected.street }} <br/>
      {{ selected.city }} {{ selected.state }} {{ selected.zip }} <br/>
      {{ selected.country }}
    </blockquote>

    <v-list subheader>
      <v-subheader>Promotions</v-subheader>
      <v-list-item v-for="promotion in promotions" :key="promotion.name">
        <v-list-tile>
          <v-list-tile-content><v-list-tile-title v-text="promotion.name" /></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>
  </v-sidebar>
</v-app>
</template>

<script>
const promotions = [
  {name: '10% Off Discount'}, {name: 'BOGO Free'}
];

export default {
  data: () => ({organizations: [], selected: {}, promotions, lon: 0, lat: 0, sidebar: false}),
  mounted,
  methods: {
    select: function({originalEvent: e}, organization) {
      this.selected = organization;
      this.lon = this.selected.lon;
      this.lat = this.selected.lat;
      this.sidebar = true;
      e.stopPropagation();
    }
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
        .then(organizations => {
          this.selected = organizations[0]
          this.lon = this.selected.lon;
          this.lat = this.selected.lat;
        });
    });
}
</script>

<style scoped lang="stylus">
.client {
  .toolbar__logo {
    font-family: 'Fredoka One', Roboto, sans-serif;
    padding-left: 15px;
    font-size: 2.5em;
  }

  .toolbar {
    border-bottom: 6px solid white;
    border-color: white !important;
  }

  .vue2leaflet-map {
    position: fixed;
    height: 100% !important;
    top: 64px;
  }
}
</style>
