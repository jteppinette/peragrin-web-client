<template>
<div>
  <v-navigation-drawer v-model="sidebar" :hide-overlay="true" temporary right light class="organization-drawer">
    <v-card class="elevation-0">

      <v-card-row class="primary">
        <v-card-title class="white--text">
          <span>
            <v-btn @click.native="sidebar = false" light icon class="hidden-sm-and-up"><v-icon large>chevron_left</v-icon></v-btn>
            {{ selected.name }}
          </span>
        </v-card-title>

      </v-card-row>
      <v-card-row class="primary" v-if="selected.category">
        <v-card-text class="category-chip"><v-chip outline class="white--text">{{ selected.category }}</v-chip></v-card-text>
      </v-card-row>
      <v-card-row v-if="selected.logo" :img="selected.logo" height="130px"></v-card-row>

      <v-tabs scroll-bars v-model="active" light class="tabs-no-border">

        <!-- BAR -->
        <v-tabs-bar slot="activators">
          <v-tabs-item ripple href="#general">General</v-tabs-item>
          <v-tabs-item ripple href="#promotions" v-if="selected.promotions && selected.promotions.length">Promotions</v-tabs-item>
        </v-tabs-bar>

        <!-- GENERAL -->
        <v-tabs-content id="general"><organization-details :organization="selected"></organization-details></v-tabs-content>

        <!-- PROMOTIONS -->
        <v-tabs-content id="promotions">
          <v-expansion-panel class="elevation-0">
            <v-expansion-panel-content v-for="promotion in selected.promotions" :key="promotion.name">
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

      </v-tabs>

    </v-card>
  </v-navigation-drawer>
  <community-map :community="community" @select="select" v-if="community"></community-map>
</div>
</template>

<script>
import organizationDetails from 'common/organization/details';
import communityMap from 'common/community/map';

export default {
  data: () => ({active: undefined, community: undefined, selected: {}, sidebar: false, msg: '', error: undefined}),
  mounted,
  methods: {select, redeem},
  components: {organizationDetails, communityMap}
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
  top: 56px;
  z-index: 1;
}
</style>

<style lang="stylus">
.organization-drawer {
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
  }

  .tabs-no-border {
    .tabs__items {
      border-style: none;
    }
  }
}
</style>
