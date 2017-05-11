<template>
<v-app left-fixed-sidebar footer top-toolbar class="console">
  <header>
    <v-toolbar class="elevation-0">
      <v-toolbar-side-icon @click.native.stop="open = !open" class="hidden-lg-and-up" />
      <v-toolbar-title>{{ name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom origin="top right" transition="v-scale-transition">
        <v-btn dark icon slot="activator"><v-icon>account_circle</v-icon></v-btn>
        <v-list>
          <v-list-item>
            <v-list-tile><v-list-tile-title>View Profile</v-list-tile-title></v-list-tile>
            <v-list-tile><v-list-tile-title>Settings</v-list-tile-title></v-list-tile>
            <v-list-tile @click.native="logout"><v-list-tile-title>Log Out</v-list-tile-title></v-list-tile>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </header>
  <main>

    <v-sidebar fixed v-model="open" class="elevation-0">
      <div class="sidebar__logo">
        <router-link to="/overview" ><img src="/assets/images/logo-white.png" /></router-link>
        <h3>peragrin</h3>
      </div>
      <v-list two-line>
        <v-divider light />
        <v-list-item v-for="item in navigation" :key="item.name">
          <v-list-tile ripple router :href="item.href">
            <v-list-tile-action><v-icon medium>{{ item.action }}</v-icon></v-list-tile-action>
            <v-list-tile-content><v-list-tile-title />{{ item.name }}</v-list-tile-title></v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </v-list>
    </v-sidebar>

    <v-content>
      <v-container fluid class="pa-3">
        <router-view></router-view>
      </v-container>
    </v-content>

  </main>
  <v-footer></v-footer>
</v-app>
</template>

<script>
const navigation = [
  {name: 'Overview', action: 'explore', href: '/console/overview'},
  {name: 'News Feed', action: 'rss_feed', href: '/console/news-feed'},
  {name: 'Map', action: 'map', href: '/console/map'},
  {name: 'Calendar', action: 'event', href: '/console/calendar'},
  {name: 'Chat', action: 'chat', href: '/console/chat'}
];

export default {
  data: () => ({open: true, navigation, name: ''}),
  mounted: function() {
    this.$route.matched.forEach(match => match.name ? this.name = match.name : undefined);
  },
  methods: {
    logout: function() {
      sessionStorage.clear();
      this.$router.push('/auth/login');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>

<style lang="stylus">
@import '../base';

.toolbar__title {
  text-transform: uppercase;
}

.sidebar {
  .list__tile__content {
    font-size: 18x;
  }
}

.sidebar__logo {
  padding: 10px;

  img {
    margin: 0 auto;
    height: 125px;
    display: block;

    @media screen and (max-width: $grid-breakpoints.sm) {
      height: 100px;
    }
  }

  h3 {
    color: white;
    font-family: 'Fredoka One', cursive;
    text-align: center;

    @media screen and (max-width: $grid-breakpoints.sm) {
      font-size: $headings.h3.size * .8;
    }
  }
}
</style>
