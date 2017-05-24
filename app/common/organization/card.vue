<template>
  <v-card>

    <v-card-title class="primary">{{ organization.name || 'Your Organization' }}</v-card-title>

    <v-subheader>General</v-subheader>
    <v-card-row>
      <v-card-text>
        <strong>{{ organization.name }}</strong>
      </v-card-text>
    </v-card-row>

    <v-subheader>Hours of Operation</v-subheader>
    <v-card-row class="hours">
      <v-card-column><p v-for="day in hours"><strong>{{ weekdays[day.weekday] }}</strong></p></v-card-column>
      <v-card-column><p v-for="day in hours">{{ day.start | to12hr }} - {{ day.close | to12hr }}</p></v-card-column>
    </v-card-row>

    <v-list subheader v-if="communities.length">
      <v-subheader v-if="communities.length">Communities</v-subheader>
      <v-list-item v-for="community in communities" :key="community.name" @click="$emit('community:selected', community)">
        <v-list-tile>
          <v-list-tile-content><v-list-tile-title v-text="community.name" /></v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>

    <v-subheader>Address</v-subheader>
    <v-card-row>
      <v-card-text>
        <blockquote>
          {{ organization.street }} <br/>
          {{ organization.city }} {{ organization.state }} {{ organization.zip }} <br/>
          {{ organization.country }}
        </blockquote>
      </v-card-text>
    </v-card-row>

    <v-card-row v-if="organization.lon && organization.lat">
      <v-map v-if="organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
        <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
        <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
           <v-popup :content="organization.name"></v-popup>
        </v-marker>
      </v-map>
    </v-card-row>

  </v-card>
</template>

<script>
import {WEEKDAYS, to12hr} from 'common/time';

export default {
  data: () => ({weekdays: WEEKDAYS}),
  props: {
    organization: {
      type: Object,
      required: true,
    },
    communities: {
      type: Array,
      default: () => []
    },
    hours: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    'to12hr': value => to12hr(value)
  }
};
</script>

<style scoped lang="stylus">
.hours {
  padding-left: 20px;
}
</style>
