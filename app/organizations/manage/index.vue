<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Organizations</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap v-if="account && account.organizations">
    <v-flex xs12 md6 lg4 v-for="organization in account.organizations" v-if="organization" :key="organization.id">

      <v-card>
        <v-card-title primary-title class="primary headline">{{ organization.name }}</v-card-title>
        <v-card-text class="primary"><v-chip v-if="organization.category" outline class="ma-0 white--text">{{ organization.category }}</v-chip></v-card-text>

        <organizations-details :organization="organization"></organizations-details>
        <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :icon="organization.icon"></v-marker>
        </v-map>
        <v-card-actions>
          <v-btn flat :to="`/organizations/${organization.id}`">Manage</v-btn>
        </v-card-actions>

      </v-card>

    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import organizationsDetails from 'common/organizations/details';

export default {
  components: {organizationsDetails},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  mounted () {
    return this.$store.dispatch('initialize');
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};
</script>

<style scoped lang="stylus">
.leaflet-container {
  height: 100px;
}
</style>
