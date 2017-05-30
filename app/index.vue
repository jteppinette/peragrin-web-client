<template>
<v-app>

  <!-- SIDE NAVIGATION -->
  <v-navigation-drawer v-if="!$route.path.includes('auth')" v-model="navbar" :mini-variant.sync="mini" clipped persistent light>

    <!-- PROFILE -->
    <v-list v-if="account.email">
      <v-list-item>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar><v-gravatar :email="account.email"></v-gravatar></v-list-tile-avatar>
          <v-list-tile-content><v-list-tile-title>{{ account.email }}</v-list-tile-title></v-list-tile-content>
          <v-list-tile-action><v-btn icon dark @click.native.stop="mini = !mini"><v-icon>chevron_left</v-icon></v-btn></v-list-tile-action>
        </v-list-tile>
      </v-list-item>
    </v-list> 

    <!-- PAGES -->
    <v-list>
      <v-divider v-if="account.email"></v-divider>
      <v-list-item v-if="!account.email">
        <v-list-tile :router="true" href="/auth/login">
          <v-list-tile-action><v-icon>lock_open</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Login</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item>
        <v-list-tile :router="true" href="/map">
          <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Map</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item v-if="account.organizations">
        <v-list-tile :router="true" href="/overview">
          <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Overview</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

  <!-- TOOLBAR -->
  <v-toolbar v-if="!$route.path.includes('auth')" class="primary elevation-0" fixed>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="navbar = !navbar" light></v-toolbar-side-icon>
    <v-toolbar-title>peragrin</v-toolbar-title>
    <v-toolbar-items class="hidden-md-and-down">
      <v-toolbar-item v-if="!account.email" :router="true" href="/auth/login" ripple>Login</v-toolbar-item>
    </v-toolbar-items>
    <v-menu v-if="account.email" bottom origin="top right" transition="v-scale-transition">
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

  <!-- MAIN -->
  <main>
    <router-view></router-view>
  </main>

  <!-- FOOTER -->
  <v-footer></v-footer>

</v-app>
</template>

<script>
import L from 'leaflet';

L.Icon.Default.imagePath = '/';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

import Gravatar from 'vue-gravatar';

export default {
  data: () => ({navbar: true, mini: true}),
  methods: {logout},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  components: {
    'v-gravatar': Gravatar
  }
};

function logout() {
  return this.$store.dispatch('logout')
    .then(() => this.$router.push('/auth/login'));
}
</script>

<style lang="stylus">
@import "~leaflet/dist/leaflet.css";

.leaflet-container {
  z-index: 5;
  height: 350px !important;
}

.flex > .stepper, .flex > .card {
  margin-bottom: 10px;
}

.card__title.primary {
  color: white;
  font-family: 'Fredoka One', cursive;
}

.container > .subheader {
  padding: 0px;
}

.input-group {
  margin: 0px;
  margin-top: 10px;
}

.stepper, .stepper__content, .stepper__wrapper {
  overflow: visible;
}

.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
}
</style>
