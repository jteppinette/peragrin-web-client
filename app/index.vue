<template>
<v-app>

  <!-- SIDE NAVIGATION -->
  <v-navigation-drawer v-if="!$route.path.includes('auth')" v-model="navbar" :mini-variant.sync="mini" clipped persistent light>

    <!-- PROFILE -->
    <v-list v-if="account">
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
      <v-divider v-if="account"></v-divider>
      <v-list-item v-if="!account">
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
      <v-list-item v-if="account && account.organizations">
        <v-list-tile :router="true" href="/organizations">
          <v-list-tile-action><v-icon>business</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Organizations</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-list-item v-if="account && account.organizations && account.organizations.find(v => v.communities)">
        <v-list-tile :router="true" href="/communities">
          <v-list-tile-action><v-icon>account_balance</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title>Communities</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

  <!-- TOOLBAR -->
  <v-toolbar v-if="!$route.path.includes('auth')" class="primary elevation-0" fixed light>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="navbar = !navbar" light></v-toolbar-side-icon>
    <v-toolbar-title white>peragrin</v-toolbar-title>
    <v-toolbar-items class="hidden-md-and-down">
      <v-toolbar-item v-if="!account" :router="true" href="/auth/login" ripple>Login</v-toolbar-item>
    </v-toolbar-items>
    <v-menu v-if="account" bottom left origin="bottom left" transition="v-scale-transition">
      <v-btn light icon slot="activator"><v-icon>account_circle</v-icon></v-btn>
      <v-list>
        <v-list-item>
          <v-list-tile router href="/profile"><v-list-tile-title>Profile</v-list-tile-title></v-list-tile>
          <v-list-tile @click.native="logout"><v-list-tile-title>Log Out</v-list-tile-title></v-list-tile>
        </v-list-item>
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
@import "~leaflet/dist/leaflet.css";

.leaflet-container {
  z-index: 2;
}

.flex > .stepper, .flex > .card {
  margin-bottom: 10px;
}

.card__title {
  font-family: 'Fredoka One', cursive;

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

.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
}

.card__title {
  padding: 10px;

  .btn.btn--floating {
    position: absolute;
    right: 15px;
    top: 40px;
  }
}

.navigation-drawer--light.navigation-drawer--right {
  border-left: none !important;
}

.expansion-panel>li {
  border: none !important;
}

.dialog {
  font-family: Roboto,sans-serif;
}

.container .subheader {
  padding: 0px;
}

.tabs__item {
  padding: 16px;
}

.category-chip {
  padding: 0px 10px;

  .chip {
    margin: 0px;
  }
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
</style>
