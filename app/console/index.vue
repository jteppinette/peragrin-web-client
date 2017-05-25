<template>
<v-app class="console">
  <v-navigation-drawer v-model="navbar" :mini-variant.sync="mini" clipped persistent light>

    <v-list>
      <v-list-item>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
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
      <v-list-item v-for="item in navigation" :key="item.name">
        <v-list-tile ripple router :href="item.href">
          <v-list-tile-action><v-icon>{{ item.action }}</v-icon></v-list-tile-action>
          <v-list-tile-content><v-list-tile-title />{{ item.name }}</v-list-tile-title></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

  <v-toolbar class="primary elevation-0" fixed>
    <v-toolbar-side-icon class="hidden-lg-and-up" @click.native.stop="navbar = !navbar" light></v-toolbar-side-icon>
    <v-toolbar-title>peragrin</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu bottom origin="top right" transition="v-scale-transition">
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

    <v-container fluid class="pa-3">
      <router-view></router-view>
    </v-container>

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
  data: () => ({navbar: true, mini: true, navigation, name: ''}),
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

<style scoped lang="stylus">
.toolbar__title {
  font-family: 'Fredoka One', Roboto, sans-serif;
}
</style>
