<template>
<div>
  <v-navigation-drawer v-model="sidebar" hide-overlay temporary right class="organization-drawer">
    <v-card flat img>

      <v-card-title class="primary">
        <span>
          <v-btn @click.native="sidebar = false" icon class="hidden-sm-and-up ma-0" style="bottom: 5px"><v-icon large class="white--text">chevron_left</v-icon></v-btn>
          <span class="headline">{{ selected.name }}</span>
        </span>
      </v-card-title>

      <v-card-text v-if="selected.category" class="primary">
        <v-chip outline class="ma-0 white--text">{{ selected.category }}</v-chip>
      </v-card-text>

      <v-card-media v-if="selected.logoURL" :src="selected.logoURL" height="130px"></v-card-media>

      <v-tabs dark :scrollable="false" v-model="active" class="tabs-no-border">

        <!-- BAR -->
        <v-tabs-bar slot="activators">
          <v-tabs-item ripple href="#general">General</v-tabs-item>
          <v-tabs-item ripple href="#promotions" v-if="selected.promotions && selected.promotions.length">Promotions</v-tabs-item>
          <v-tabs-slider class="white"></v-tabs-slider>
        </v-tabs-bar>

        <!-- GENERAL -->
        <v-tabs-content id="general"><organizations-details :organization="selected"></organizations-details></v-tabs-content>

        <!-- PROMOTIONS -->
        <v-tabs-content id="promotions">
          <v-expansion-panel class="elevation-0">
            <v-expansion-panel-content v-for="promotion in selected.promotions" :key="promotion.name">
              <div slot="header"><strong>{{ promotion.name }}</strong><br><small>{{ promotion.description }}</small></div>
              <v-card>
                <v-card-text>
                  <v-card class="elevation-3 white--text">

                    <v-card-title class="primary">
                      <div>
                        <span class="title">{{ promotion.name }}</span>
                        <p class="mb-0">{{ promotion.description }}</p>
                      </div>
                    </v-card-title>

                    <v-list two-line class="pt-0 pb-0">
                      <v-list-tile v-if="promotion.expiration">
                        <v-list-tile-action><v-icon>timer</v-icon></v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Expiration</v-list-tile-title>
                          <v-list-tile-sub-title>{{ promotion.expiration | moment("from", true) }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="promotion.exclusions">
                        <v-list-tile-action><v-icon>warning</v-icon></v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Exclusions</v-list-tile-title>
                          <v-list-tile-sub-title>{{ promotion.exclusions }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="promotion.isSingleUse">
                        <v-list-tile-action><v-icon>looks_one</v-icon></v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>Single Use</v-list-tile-title>
                          <v-list-tile-sub-title>This promotion can only be redeemed once.</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>

                    <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
                    <v-card-actions>
                      <v-btn primary block :disabled="promotion.redeemed || error" @click.native="redeem(promotion)">{{ promotion.redeemed ? 'Redeemed' : 'Redeem' }}</v-btn>
                    </v-card-actions>

                  </v-card>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-tabs-content>

      </v-tabs>

    </v-card>
  </v-navigation-drawer>
  
  <v-container fluid class="pl-2 pr-2 pt-0 pb-0 elevation-1 grey lighten-4 categories">
    <v-btn :ripple="false" flat v-for="category in categories" class="hidden-sm-and-down" @click.native="filter.category = filter.category == category.name ? '' : category.name" :key="category.name"><v-icon left :class="{'primary--text': filter.category == category.name}">{{ category.icon }}</v-icon> {{ category.name }}</v-btn>
    <v-btn :ripple="false" flat v-for="category in categories" :icon="filter.category != category.name" class="hidden-md-and-up" @click.native="filter.category = filter.category == category.name ? '' : category.name" :key="category.name"><v-icon :left="filter.category == category.name" :class="{'primary--text': filter.category == category.name}">{{ category.icon }}</v-icon>{{ filter.category == category.name ? category.name : '' }}</v-btn>
  </v-container>

  <communities-map :filter="filter" :community="community" @select="select" v-if="community"></communities-map>

</div>
</template>

<script>
import organizationsDetails from 'common/organizations/details';
import communitiesMap from 'common/communities/map';
import {CATEGORIES} from 'common/categories';

let filter = {
  category: ''
};

export default {
  data: () => ({active: undefined, community: undefined, selected: {}, sidebar: false, msg: '', error: undefined, filter, categories: CATEGORIES}),
  mounted,
  methods: {select, redeem},
  components: {organizationsDetails, communitiesMap}
};

function mounted() {
  this.$http.get('/communities')
    .then(response => response.json())
    .then(communities => this.community = communities[0]);
}

function select(organization) {
  var hours = this.$http.get(`/organizations/${organization.id}/hours`).then(response => response.json());
  var promotions = this.$http.get(`/organizations/${organization.id}/promotions`).then(response => response.json());
  return Promise.all([hours, promotions]).then(values => {
    this.selected = {...organization, hours: values[0], promotions: values[1]};
    if (!this.selected.promotions.length) this.active = 'general';
    this.sidebar = true;
  });
}

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

<style scoped lang="stylus">
.vue2leaflet-map {
  position: fixed;
  height: 100% !important;
  z-index: 1;
  top: 96px;
}
</style>

<style lang="stylus">
.container.categories {
  z-index: 2;
  position: fixed;
  overflow-x: scroll;
  white-space: nowrap;

  .btn, .btn__content, .btn__content:before {
    -moz-transition: none;
    -webkit-transition: none;
    -o-transition: color 0 ease-in;
    transition: none;
  }
}

.organization-drawer {
  z-index: 7 !important;
  border: 0;
  padding: 0px;

  &.navigation-drawer--open {
    width: 400px;
    max-width: 90vw;
  }

  .expansion-panel__header {
    min-height: 60px;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: inherit;

    > div {
      margin-right: 30px
    }
  }

  .tabs-no-border {
    .tabs__items {
      border-style: none;
    }
  }
}
</style>
