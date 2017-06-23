<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Organizations</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap class="mb-3" v-if="account && account.organizations">
    <v-flex xs12 md6 lg4 v-for="organization in account.organizations" v-if="organization" :key="organization.id">

      <v-card>
        <v-card-title class="primary">
          <router-link :to="`/organizations/${organization.id}`" class="white--text">{{ organization.name }}</router-link>
        </v-card-title>
        <v-card-row class="primary" v-if="organization.category">
          <v-card-text class="category-chip"><v-chip outline class="white--text">{{ organization.category }}</v-chip></v-card-text>
        </v-card-row>
        <organization-details :organization="organization"></organization-details>
        <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :icon="organization.icon"></v-marker>
        </v-map>
      </v-card>

    </v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs12 v-for="community in communities" :key="community.id" v-if="community">
      <v-card>
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :community="community"></community-organizations-list>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import organizationDetails from 'common/organization/details';

export default {
  components: {communityOrganizationsList, organizationDetails},
  computed: {
    account () {
      return this.$store.state.account;
    },
    communities () {
      if (!this.account || !this.account.organizations || !this.account.organizations.length) return undefined;
      var l = [];
      for (let i in this.account.organizations) {
        l = l.concat(this.account.organizations[i].communities);
      }
      return l;
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
