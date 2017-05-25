<template>
  <v-card class="elevation-0">

    <v-card-title class="primary">{{ organization.name || 'Your Organization' }}</v-card-title>

    <v-tabs scroll-bars v-model="active" light class="tabs-no-border">
      <v-tabs-bar slot="activators" :style="{display: promotions.length || communities.length ? 'block' : 'none'}">
        <v-tabs-item ripple href="#general">General</v-tabs-item>
        <v-tabs-item ripple href="#promotions" v-if="promotions.length">Promotions</v-tabs-item>
        <v-tabs-item ripple href="#communities" v-if="communities.length">Communities</v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="general">
        <v-list two-line>

          <!-- PHONE -->
          <v-list-item>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="primary--text">phone</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title><a :href="'tel:'+organization.phone">{{ organization.phone }}</a></v-list-tile-title>
                <v-list-tile-sub-title>Phone</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>

          <!-- EMAIL -->
          <v-list-item>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="primary--text">mail_outline</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title><a :href="'mailto:'+organization.email">{{ organization.email }}</a></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>

          <!-- WEBSITE -->
          <v-list-item>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="primary--text">link</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title><a :href="organization.website">{{ organization.website }}</a></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>

          <!-- ADDRESS -->
          <v-list-item>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="primary--text">location_on</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title><a :href="'geopoint:'+organization.lat+','+organization.lon">{{ organization.street }}</a></v-list-tile-title>
                <v-list-tile-sub-title>{{ organization.city}} , {{ organization.state }} {{ organization.zip }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>

          <!-- HOURS OF OPERATION -->
          <v-list-item class="hours">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon class="primary--text">access_time</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <p v-for="day in hours">
                  <strong class="text-left">{{ weekdays[day.weekday] }}</strong>
                  <span class="text-right">{{ day.start | to12hr }} - {{ day.close | to12hr }}</span>
                </p>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>

        </v-list>

        <v-card-row v-if="active == 'general' && !disableMap && organization.lon && organization.lat">
          <v-map v-if="organization.lon && organization.lat" :zoom="15" :center="[organization.lat, organization.lon]">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
            <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}">
               <v-popup :content="organization.name"></v-popup>
            </v-marker>
          </v-map>
        </v-card-row>

      </v-tabs-content>

      <v-tabs-content id="promotions">
        <v-list two-line>
          <v-list-item v-for="promotion in promotions" :key="promotion.name">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ promotion.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ promotion.description }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-tabs-content>

      <v-tabs-content id="communities">
        <v-list>
          <v-list-item v-for="community in communities" :key="community.name" @click="$emit('community:selected', community)">
            <v-list-tile>
              <v-list-tile-content><v-list-tile-title v-text="community.name" /></v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-tabs-content>

    </v-tabs>

  </v-card>
</template>

<script>
import {WEEKDAYS, to12hr} from 'common/time';

export default {
  data: () => ({active: null, weekdays: WEEKDAYS}),
  props: {
    promotions: {type: Array, default: () => []},
    organization: {type: Object, required: true},
    communities: {type: Array, default: () => []},
    hours: {type: Array, default: () => []},
    disableMap: {type: Boolean, default: () => false},
  },
  watch: {
    organization: function() {
      this.active = 'general';
    }
  },
  filters: {
    'to12hr': value => to12hr(value)
  }
};
</script>

<style scoped lang="stylus">
.card__title {
  padding: 10px;
}

.hours {
  .list__tile {
    height: 100%;
    padding: 20px 16px;

    .list__tile__content {
      display: block;
      max-width: 300px !important;

      p {
        padding-bottom: 15px;
      }
      strong {
        float: left;
      }
      span {
        float: right;
      }
    }
 }
}

a {
  text-decoration: none;
  color: inherit;
}
</style>

<style lang="stylus">
.tabs-no-border {
  .tabs__items {
    border-style: none;
  }
}
</style>
