<template>
<v-card class="elevation-0 organization-card">

    <v-card-row class="primary">
      <v-card-title class="white--text">{{ organization.name || 'Your Organization' }}</v-card-title>
    </v-card-row>
    <v-card-row class="primary" v-if="organization.category">
      <v-card-text class="category-chip"><v-chip outline class="white--text">{{ organization.category }}</v-chip></v-card-text>
    </v-card-row>

  <v-card-row v-if="organization.logo" :img="organization.logo" height="130px"></v-card-row>

  <v-tabs scroll-bars v-model="active" light class="tabs-no-border">
    <v-tabs-bar slot="activators" :style="{display: (organization.promotions && organization.promotions.length) || (organization.communities && organization.communities.length) ? 'block' : 'none'}">
      <v-tabs-item ripple href="#general">General</v-tabs-item>
      <v-tabs-item ripple href="#promotions" v-if="organization.promotions && organization.promotions.length">Promotions</v-tabs-item>
      <v-tabs-item ripple href="#communities" v-if="organization.communities && organization.communities.length">Communities</v-tabs-item>
    </v-tabs-bar>
    <v-tabs-content id="general">

      <v-layout row wrap class="general">
        <v-flex xs12 :class="{sm6: !disableMap}" class="pr-0">
          <organization-details :organization="organization"></organization-details>
        </v-flex>
        <v-flex xs12 sm6 class="pl-0" v-if="loaded && !disableMap && organization.lon && organization.lat">
          <v-map :zoom="15" :center="[organization.lat, organization.lon]">
            <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
            <v-marker :lat-lng="{'lat': organization.lat, 'lng': organization.lon}"></v-marker>
          </v-map>
        </v-flex>
      </v-layout>

    </v-tabs-content>

    <v-tabs-content id="promotions">

      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-content v-for="promotion in organization.promotions" :key="promotion.name">
          <div slot="header"><strong>{{ promotion.name }}</strong><br/><small>{{ promotion.description }}</small></div>
          <v-card>
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
            <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
            <v-card-row actions>
              <v-btn default block :disabled="promotion.redeemed || error" @click.native="redeem(promotion)">{{ promotion.redeemed ? 'Redeemed' : 'Redeem' }}</v-btn>
            </v-card-row>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-tabs-content>

    <v-tabs-content id="communities">
      <v-list>
        <v-list-item v-for="community in organization.communities" :key="community.name" @click="$emit('community:selected', community)">
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
import organizationDetails from 'common/organization/details';

export default {
  data: () => ({loaded: false, active: undefined, error: false, msg: ''}),
  components: {organizationDetails},
  props: {
    organization: {type: Object},
    disableMap: {type: Boolean, default: () => false},
  },
  watch: {
    organization () {
      this.active = 'general';
    },
    active () {
      setTimeout(() => this.loaded = true, 500);
    }
  },
  methods: {redeem},
};

function redeem(promotion) {
  return this.$http.post(`/promotions/${promotion.id}/redeem`)
    .then(() => this.$set(promotion, 'redeemed', true))
    .catch(({data, status}) => {
      this.error = true;
      if (status == 401) {
        this.msg = 'you must login to access this peragrin feature';
      } else if (data && data.msg) {
        this.msg = data.msg;
      } else {
        this.msg = 'unknown error';
      }
    });
}
</script>

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

  .leaflet-container {
    height: 380px;
  }
}
</style>
