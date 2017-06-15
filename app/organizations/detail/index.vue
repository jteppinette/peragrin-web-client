<template>
<v-container class="organization-details">

  <v-card class="elevation-2 mb-3">
    <v-card-row class="primary">
      <v-card-title class="white--text">{{ organization.name }}</v-card-title>
    </v-card-row>
    <v-card-row class="primary" v-if="organization.category">
      <v-card-text class="category-chip"><v-chip outline class="white--text">{{ organization.category }}</v-chip></v-card-text>
    </v-card-row>

    <v-layout row wrap class="general">

      <v-flex xs12 md6 class="pr-0">
        <organization-details :organization="organization"></organization-details>
      </v-flex>

      <v-flex xs12 md6>
        <v-map v-if="organization.lat && organization.lon" :zoom="15" :center="[organization.lat, organization.lon]">
          <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
          <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}"></v-marker>
        </v-map>
      </v-flex>

    </v-layout>

  </v-card>

  <v-card v-if="organization && community">
    <v-card-title class="primary">Promotions</v-card-title>
    <promotions-list :community="community" :organizationID="id"></promotions-list>
  </v-card>

</v-container>
</template>

<script>
import promotionsList from 'common/promotions/list';
import organizationDetails from 'common/organization/details';

export default {
  props: ['id'],
  data: () => ({organization: {}}),
  components: {promotionsList, organizationDetails},
  computed: {
    community () {
      return this.$store.state.community;
    }
  },
  mounted () {
    this.$http.get(`/organizations/${this.id}`)
      .then(response => response.json())
      .then(organization => this.organization = {...this.organization, ...organization});
    this.$http.get(`/organizations/${this.id}/hours`)
      .then(response => response.json())
      .then(hours => this.$set(this.organization, 'hours', hours));
  }
};
</script>

<style lang="stylus">
.organization-details .leaflet-container {
  height: 380px;
}
</style>
