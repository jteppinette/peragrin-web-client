<template>
<v-row class="overview">
  <v-col lg6>
    <v-card class="elevation-3">
      <v-card-title class="primary white--text">Organizations</v-card-title>
      <v-data-table v-model="organizations" :headers="headers" hide-actions>
        <template slot="items" scope="props">
          <td class="text-xs-right">{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.address }}</td>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
  <v-col lg6>
    <v-card v-if="organization" class="map-card elevation-3">
      <v-card-title class="primary white--text">Map</v-card-title>
      <v-map :zoom=15 :center="[organization.latitude, organization.longitude]">
        <v-tilelayer :token="mapboxAPIKey" url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={token}"></v-tilelayer>
        <v-marker :lat-lng="{'lat': organization.latitude, 'lng': organization.longitude}">
           <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
    </v-card>
  </v-col>
</v-row>
</template>

<script>
// TODO: sortable needs to be removed, bug fix in data table component required
const headers = [
  {
    text: 'Name',
    value: 'name',
    sortable: true
  },
  {
    text: 'Address',
    value: 'address',
    sortable: true
  }
];

export default {
  data: () => ({organization: undefined, organizations: [], headers, mapboxAPIKey: sessionStorage.mapboxAPIKey}),
  mounted
};

function mounted () {
  this.$http.get('/organizations')
    .then(response => response.json())
    .then(function(organizations) {
        return organizations.map(function(v) {
          v.value = false;
          return v;
        });
    })
    .then((organizations) => this.organizations = organizations)
    .then((organizations) => this.organization = organizations.find((v) => v.id == sessionStorage.organizationID));
}
</script>

<style lang="stylus">
$map-height := 400px;

.leaflet-container {
  z-index: 5;

  &.vue2leaflet-map {
    height: $map-height - 63 !important;
  }

  img.leaflet-marker-icon {
    transform: inherit !important;
  }
}

.map-card {
  height: $map-height;
}

</style>
