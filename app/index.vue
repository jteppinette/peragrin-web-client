<template>
<v-app>

  <!-- SIDE NAVIGATION -->
  <v-navigation-drawer v-if="!$route.path.includes('auth')" v-model="navbar" :mini-variant.sync="mini" clipped persistent>

    <!-- PROFILE -->
    <v-list v-if="account">
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar><v-gravatar :email="account.email"></v-gravatar></v-list-tile-avatar>
        <v-list-tile-content><v-list-tile-title>{{ account.email }}</v-list-tile-title></v-list-tile-content>
        <v-list-tile-action><v-btn icon @click.native.stop="mini = !mini"><v-icon>chevron_left</v-icon></v-btn></v-list-tile-action>
      </v-list-tile>
    </v-list> 

    <!-- PAGES -->
    <v-list>
      <v-divider v-if="account"></v-divider>
      <v-list-tile v-if="!account" to="/auth/login">
        <v-list-tile-action><v-icon>lock_open</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Login</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/map">
        <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Map</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="account && account.organizations" to="/organizations">
        <v-list-tile-action><v-icon>business</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Organizations</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="account && account.organizations && account.organizations.find(v => v.communities)" to="/communities">
        <v-list-tile-action><v-icon>account_balance</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Communities</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
    </v-list>

  </v-navigation-drawer>

  <!-- TOOLBAR -->
  <v-toolbar v-if="!$route.path.includes('auth')" class="primary elevation-0" dark fixed>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="navbar = !navbar"></v-toolbar-side-icon>
    <v-toolbar-title>peragrin</v-toolbar-title>
    <v-spacer></v-spacer>
    <router-link class="hidden-md-and-down white--text" v-if="!account" to="/auth/login">Login</router-link>
    <v-menu v-if="account" bottom left origin="bottom left" transition="v-scale-transition">
      <v-btn icon slot="activator"><v-icon class="white--text">account_circle</v-icon></v-btn>
      <v-list>
        <v-list-tile to="/profile">
          <v-list-tile-content><v-list-tile-title>Profile</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click.native="logout">
          <v-list-tile-content><v-list-tile-title>Log Out</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>

  <!-- MAIN -->
  <main>
    <router-view></router-view>
  </main>

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
  this.$router.push('/auth/login');
  this.$store.dispatch('logout');
}
</script>

<style lang="stylus">
@import '../settings';
@import "~leaflet/dist/leaflet.css";

.leaflet-container {
  z-index: 2;
}

.layout {
  margin-bottom: 8px;
}

.card__title {

  &.title, &.headline, .title, .headline {
    font-family: 'Fredoka One', cursive;
  }

  &.primary {
    color: white;
  }
}

.menu__content {
  min-width: inherit !important;
}

.stepper__wrapper {
  min-height: 350px;
}

.btn.btn--floating {
  z-index: 3;
}

.navigation-drawer--light.navigation-drawer--right {
  border-left: none !important;
}

.expansion-panel>li {
  border: none !important;
}

.dialog__container {
  display: block !important;
}

.dialog {
  font-family: Roboto,sans-serif;

  .card__text {
    max-height: 60vh !important;
  }
}

.container .subheader {
  padding: 0px;
}

.tabs__item {
  padding: 16px;
}

.breadcrumbs {
  padding-left: 0px !important;
  justify-content: flex-start !important;

  a.breadcrumbs__item {
    padding-left: 0px !important;
  }

  li {
    padding: 0 14px;

    &:first-child {
      padding: 0px;
    }
  }
}

.pl-0-lg {
  @media (min-width: $grid-breakpoints.md) {
    padding-left: 0px !important;
  }
}

.pr-0-lg {
  @media (min-width: $grid-breakpoints.md) {
    padding-right: 0px !important;
  }
}
</style>
