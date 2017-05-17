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
      <v-map v-if="lat && lon" :zoom="14" :center="[lat, lon]">
        <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
        <v-marker v-for="organization in organizations" @l-click="selected = organization" :key="organization.id" :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
          <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
    </v-content>
    <v-sidebar v-if="selected.id" right class="scroll-y" scroll-y>

      <v-subheader>General</v-subheader>
      <v-container>
        <p><strong class="white--text">{{ selected.name }}</strong></p>
      </v-container>

      <v-divider></v-divider>

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
  </main>
</v-app>
</template>

<script>
const promotions = [
  {name: '10% Off Discount'}, {name: 'BOGO Free'}
];

export default {
  data: () => ({organizations: [], loading: true, selected: {}, promotions, lon: 0, lat: 0}),
  mounted
};

function mounted() {
  geo()
    .then(({lon, lat}) => {
      this.lon = lon;
      this.lat = lat;
      this.loading = false;
    });
  this.$http.get('/organizations')
    .then(response => response.json())
    .then(organizations => this.organizations = organizations);
}

function geo() {
  const fb = {lon: -84.30444, lat: 33.79023};
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return resolve({lon: fb.lon, lat: fb.lat});
    navigator.geolocation.getCurrentPosition(({coords: {longitude, latitude}}) => {
      return resolve({lon: longitude, lat: latitude});
    }, () => {
      return resolve({lon: fb.lon, lat: fb.lat});
    });
  });
}
</script>

<style scoped lang="stylus">
.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
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
