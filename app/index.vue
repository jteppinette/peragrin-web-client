<template>
<v-app toolbar>

  <!-- SIDE NAVIGATION -->
  <v-navigation-drawer v-model="navbar" :mini-variant.sync="mini" clipped persistent>

    <!-- PROFILE -->
    <v-list v-if="account" style="margin-top: 9px">
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar><gravatar :email="account.email"></gravatar></v-list-tile-avatar>
        <v-list-tile-content><v-list-tile-title>{{ account.email }}</v-list-tile-title></v-list-tile-content>
        <v-list-tile-action v-if="!mini"><v-btn icon @click.stop="mini = !mini"><v-icon>chevron_left</v-icon></v-btn></v-list-tile-action>
      </v-list-tile>
    </v-list> 

    <!-- PAGES -->
    <v-list class="large" :style="{'margin-top: 9px': !account}">
      <v-divider v-if="account"></v-divider>
      <v-list-tile v-if="!account" to="/auth/login">
        <v-list-tile-action><v-icon>lock_open</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Login</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/map">
        <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Map</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="account && organizations.length" to="/organizations">
        <v-list-tile-action><v-icon>business</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Organizations</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="account && (organizations.length || account.isSuper)" to="/communities">
        <v-list-tile-action><v-icon>account_balance</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Communities</v-list-tile-title></v-list-tile-content>
      </v-list-tile>
    </v-list>

  </v-navigation-drawer>

  <!-- TOOLBAR -->
  <v-toolbar class="primary elevation-0" dark fixed>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.stop="navbar = !navbar"></v-toolbar-side-icon>
    <v-toolbar-title>{{ community || 'peragrin' }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon v-if="community" @click="deselect"><v-icon class="white--text">apps</v-icon></v-btn>
    <v-menu bottom left origin="bottom left" transition="v-scale-transition">
      <v-btn icon slot="activator"><v-icon class="white--text">account_circle</v-icon></v-btn>
      <v-list>
        <v-list-tile v-if="!account" to="/auth/login">
          <v-list-tile-content><v-list-tile-title>Login / Register</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="account" to="/profile">
          <v-list-tile-content><v-list-tile-title>Profile</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="account" @click="logout">
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
import Gravatar from 'vue-gravatar';

export default {
  data: () => ({community: '', navbar: true, mini: true}),
  methods: {logout, deselect},
  computed: {
    account () {
      return this.$store.state.account;
    },
    organizations () {
      return this.$store.state.organizations;
    },
    communities () {
      return this.$store.state.communities;
    }
  },
  watch: {
    '$route.query.community' (v) {
      return this.community = v;
    }
  },
  mounted () {
    this.community = this.$route.query.community;
  },
  components: {Gravatar}
};

function deselect()  {
  this.community = undefined;
  this.$router.push('/map');
}

function logout() {
  this.$store.dispatch('logout')
  this.$router.push('/auth/login');
}
</script>

<style lang="stylus">

/***********/
/* IMPORTS */
/***********/

@import '../settings';
@import "~leaflet/dist/leaflet.css";


/***********/
/* LEAFLET */
/***********/

.leaflet-container {
  z-index: 2;

  .leaflet-control-container {

    .leaflet-bar {
      border: none !important;
    }

    .leaflet-control {
      box-shadow: 0 1px 3px rgba(0,0,0,.2),0 1px 1px rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12) !important;
    }

    .leaflet-control-attribution {
      display: none;
    }
  }
}


/**********/
/* LAYOUT */
/**********/

.container {
  > .layout {
    > .flex {
      margin-bottom: 8px;
    }
  }
}


/*********/
/* CARDS */
/*********/

.card {

  .card__text {
    &.expose {
      padding: 30px 36px !important;
      p {
        text-indent: 40px;
        max-width: 400px;
        margin: 10px auto;
        font-size: 1.3em;
      }
    }

    &.secondary a {
      color: white;
    }
  }

  .card__title, .card__text {
    padding: 20px 16px;

    &.title, &.headline, .title, .headline {
      font-family: 'Fredoka One', cursive;
    }

    &.primary {
      color: white;
      border-bottom: 5px solid $theme.accent !important;
    }
    &.secondary {
      color: white;
      border-bottom: 5px solid $theme.secondary-accent !important;
    }
    &.warning {
      color: white;
      border-bottom: 5px solid $theme.warning-accent !important;
    }
    &.error {
      color: white;
      border-bottom: 5px solid $theme.error-accent !important;
    }
  }

  .card__actions {
    &.primary {
      color: white;
      border-top: 5px solid $theme.accent !important;
    }
    &.secondary {
      color: white;
      border-top: 5px solid $theme.secondary-accent !important;
    }
    &.warning {
      color: white;
      border-top: 5px solid $theme.warning-accent !important;
    }
    &.error {
      color: white;
      border-top: 5px solid $theme.error-accent !important;
    }
  }

  .toolbar .toolbar__content {
    height: 64px !important;
  }
}


/********/
/* MENU */
/********/

.menu__content {
  min-width: inherit !important;
}

/***********/
/* STEPPER */
/***********/

.stepper__content {
  padding: 0px !important;
}

.stepper__label {
  text-align: center !important;
}


/***********/
/* BUTTONS */
/***********/

.btn.btn--floating {
  z-index: 3;
}

.speed-dial {
  z-index: 3;
}

.speed-dial--bottom.speed-dial--absolute {
  bottom: 0% !important;
}


/*********************/
/* NAVIGATION DRAWER */
/*********************/

.navigation-drawer--light.navigation-drawer--right {
  border-left: none !important;
}


/*******************/
/* EXPANSION PANEL */
/*******************/

.expansion-panel>li {
  border: none !important;
}


/**********/
/* DIALOG */
/**********/

.dialog__container {
  display: block !important;
  margin: 0px !important;
}

.dialog {
  font-family: Roboto,sans-serif;
  margin: 12px 20px !important;

  &:not(.dialog--fullscreen) {
    max-width: 95% !important;
    max-height: 95% !important;
  }

  .card__text {
    max-height: 60vh !important;
  }
}


/********/
/* TABS */
/********/

.tabs {
  border-top: 5px solid $theme.secondary-accent;

  &.no-border .tabs__items {
    border-style: none !important;
  }
}


/***************/
/* BREADCRUMBS */
/***************/

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


/*************/
/* UTILITIES */
/*************/

.pl-0-lg {
  @media $display-breakpoints.lg-and-up {
    padding-left: 0px !important;
  }
}
.pr-0-lg {
  @media $display-breakpoints.lg-and-up {
    padding-right: 0px !important;
  }
}

.pl-10-md {
  @media $display-breakpoints.md-and-up {
    padding-left: 10px !important;
  }
}
.pr-10-md {
  @media $display-breakpoints.md-and-up {
    padding-right: 10px !important;
  }
}

.pl-20-md {
  @media $display-breakpoints.md-and-up {
    padding-left: 20px !important;
  }
}
.pr-20-md {
  @media $display-breakpoints.md-and-up {
    padding-right: 20px !important;
  }
}


/***************/
/* DATA TABLES */
/***************/

.no-limit-select .datatable__actions__select {
  @media (max-width: $grid-breakpoints.md) {
    display: none !important;
  }
}


/*********/
/* LISTS */
/*********/

.list {
  padding: 0px 0px !important;

  &.large {
    .list__tile {
      height: 66px !important;
    }
  }
}


/***********/
/* TOOLBAR */
/***********/

.toolbar {

  &.primary {
    z-index: 4 !important;
    border-bottom: 5px solid $theme.accent !important;
  }

  &__title {
    font-family: 'Fredoka One', Roboto, sans-serif;

    .btn {
      text-transform: none;
      .btn__content {
        font-size: 20px
        font-weight: 500;
      }
    }
  }
}


/*********/
/* INPUT */
/*********/

.btn.file {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.btn.file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  opacity: 0;
  outline: none;
  cursor: inherit;
  display: block;
}

.input-group {
  padding-bottom: 0px !important;
}
</style>
