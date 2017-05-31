<template>
<v-card class="elevation-0 organization-card">

  <v-card-title class="primary">{{ organization.name || 'Your Organization' }}</v-card-title>

  <v-tabs scroll-bars v-model="active" light class="tabs-no-border">
    <v-tabs-bar slot="activators" :style="{display: promotions.length || communities.length ? 'block' : 'none'}">
      <v-tabs-item ripple href="#general">General</v-tabs-item>
      <v-tabs-item ripple href="#promotions" v-if="promotions.length">Promotions</v-tabs-item>
      <v-tabs-item ripple href="#communities" v-if="communities.length">Communities</v-tabs-item>
    </v-tabs-bar>
    <v-tabs-content id="general">

      <!-- CATEGORY -->
      <v-card-row v-if="organization.category">
        <v-container fluid>
          <v-chip class="primary white--text">
            <v-avatar v-if="organization.category == 'Resturaunt'"><v-icon>local_dining</v-icon></v-avatar>
            {{ organization.category }}
          </v-chip>
        </v-container>
      </v-card-row>

      <v-list two-line>

        <!-- PHONE -->
        <v-list-item v-if="organization.phone">
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
        <v-list-item v-if="organization.email">
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
        <v-list-item v-if="organization.website">
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
        <v-list-item v-if="organization.street">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="primary--text">location_on</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><a :href="'geo:'+organization.lat+','+organization.lon">{{ organization.street }}</a></v-list-tile-title>
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
          <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}" :icon="icon"></v-marker>
        </v-map>
      </v-card-row>

    </v-tabs-content>

    <v-tabs-content id="promotions">

      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-content v-for="promotion in promotions" :key="promotion.name">
          <div slot="header"><strong>{{ promotion.name }}</strong><br/><small>{{ promotion.description }}</small></div>
          <v-card class="pa-3">
            <v-card-row v-if="promotion.expiration" class="mb-3">
              <v-icon class="ml-2 mr-4" dark>timer</v-icon>
              <div>
                <div><strong>Expiration</strong></div>{{ promotion.expiration | moment("from", true) }}
              </div>
            </v-card-row>
            <v-card-row v-if="promotion.exclusions" class="mb-3">
              <v-icon class="ml-2 mr-4" dark>warning</v-icon>
              <div>
                <div><strong>Exclusions</strong></div>{{ promotion.exclusions }}
              </div>
            </v-card-row>
            <v-card-row v-if="promotion.isSingleUse">
              <v-container fluid>
                <strong>This promotion can only be redeemed once.</strong>
              </v-container>
            </v-card-row>
            <v-card-row actions>
              <v-btn default block>Redeem</v-btn>
            </v-card-row>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

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
import L from 'leaflet';

export default {
  data: () => ({icon: undefined, active: null, weekdays: WEEKDAYS}),
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
      initialize.call(this);
    }
  },
  mounted: initialize,
  filters: {
    'to12hr': value => to12hr(value)
  }
};

function initialize() {
  if (this.organization.logo) {
    this.icon = L.icon({iconUrl: this.organization.logo, iconSize: [64, 64], iconAnchor: [32, 32]});
  }
}
</script>

<style scoped lang="stylus">
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
.organization-card {
  .expansion-panel__header {
    min-height: 60px;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: inherit;
  }

  .tabs-no-border {
    .tabs__items {
      border-style: none;
    }
  }

  .container {
    padding: 12px;
  }
}
</style>
