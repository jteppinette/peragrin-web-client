<template>
<v-app class="client">
  <v-toolbar :fixed="true" class="primary">
    <v-toolbar-title>peragrin</v-toolbar-title>
    <v-toolbar-items class="hidden-md-and-down">
    <v-toolbar-item :router="true" href="/auth/login" ripple>Login</v-toolbar-item>
    </v-toolbar-items>
  </v-toolbar>
  <main>
    <v-content>
      <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
      <v-map v-if="patron.lat && patron.lon" :zoom="14" :center="[patron.lat, patron.lon]">
        <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
        <v-marker v-for="organization in organizations" @l-click="viewOrganization(organization)" :key="organization.id" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
          <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
    </v-content>
    <v-sidebar v-if="organization.id" right class="scroll-y" scroll-y>

      <v-subheader>General</v-subheader>
      <v-container>
        <p><strong class="white--text">{{ organization.name }}</strong></p>
      </v-container>

      <v-divider></v-divider>

      <v-subheader>Address</v-subheader>
      <blockquote style="color: white">
        {{ organization.street }} <br/>
        {{ organization.city }} {{ organization.state }} {{ organization.zip }} <br/>
        {{ organization.country }}
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
  </main>
</v-app>
</template>

<script>
import organizationCard from 'common/organization/card';

const coords = {
  lon: -84.30444, lat: 33.79023
};

var patron = {
  lon: 0, lat: 0
};

const promotions = [
  {name: '10% Off Discount'}, {name: 'BOGO Free'}
];

export default {
  data: () => ({patron, organizations: [], loading: true, organization: {}, promotions}),
  mounted: function() {
    coordinates.call(this)
    this.$http.get('/organizations')
      .then(response => response.json())
      .then(organizations => this.organizations = organizations);
  },
  methods: {
    viewOrganization: function(organization) {
      this.organization = organization;
    }
  },
  components: {
    organizationCard
  }
};

function coordinates() {
  if (!navigator.geolocation) {
    this.patron.lon = coords.lon;
    this.patron.lat = coords.lat;
    this.loading = false;
  }
  navigator.geolocation.getCurrentPosition(function({coords}) {
    this.patron.lon = coords.longitude;
    this.patron.lat = coords.latitude;
    this.loading = false;
  }.bind(this));
}
</script>

<style scoped lang="stylus">
.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
}

body {
  height: 100vh;
}

.leaflet-container {
  z-index: 5;
  height: 100vh !important;
}
</style>

<style lang="stylus">
.client .leaflet-control-container {
  position: absolute;
  top: 100px;
}

.client .sidebar {
  padding-top: 70px;
}

.client .progress-linear {
  top: 64px;
  z-index: 50;
  margin: 0px;
  position: absolute;
}
</style>
