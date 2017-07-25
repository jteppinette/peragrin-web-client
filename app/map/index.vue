<template>
<div class="map">
  <v-navigation-drawer v-model="sidebar" hide-overlay temporary right class="organization-drawer">
    <v-card flat img>

      <v-card-title class="primary">
        <span>
          <v-btn @click.native="sidebar = false" icon class="hidden-sm-and-up ma-0" style="bottom: 5px"><v-icon large class="white--text">chevron_left</v-icon></v-btn>
          <span class="headline">{{ selected.name }}</span>
        </span>
      </v-card-title>

      <v-card-text v-if="selected.category" class="secondary">
        <v-chip outline class="ma-0 white--text">{{ selected.category }}</v-chip>
      </v-card-text>

      <v-card-media v-if="selected.logoURL" :src="selected.logoURL" height="130px"></v-card-media>

      <v-tabs grow dark :scrollable="false" v-model="active" class="tabs-no-border">

        <!-- BAR -->
        <v-tabs-bar slot="activators" class="secondary">
          <v-tabs-item ripple href="#general">General</v-tabs-item>
          <v-tabs-item ripple href="#promotions" v-if="selected.promotions && selected.promotions.length">Promotions</v-tabs-item>
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

                    <v-list two-line>
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

                    <v-card-actions>
                      <v-btn primary block :disabled="successful || error" :error="error" :loading="submitting" @click.native="redeem(promotion)">{{ successful ? 'Redeemed' : 'Redeem' }}</v-btn>
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
  
  <communities-map :show-filter="true" :community="community" @select="select" v-if="community"></communities-map>

  <v-snackbar v-model="error" error>{{ msg }}
    <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
  </v-snackbar>

  <v-snackbar v-model="successful">successfully redeemed
    <v-btn flat @click.native="successful = false" class="white--text">Close</v-btn>
  </v-snackbar>

</div>
</template>

<script>
import organizationsDetails from 'common/organizations/details';
import communitiesMap from 'common/communities/map';

export default {
  data: () => ({successful: false, submitting: false, active: undefined, communities: [], community: undefined, selected: {}, sidebar: false, msg: '', error: undefined}),
  mounted: initialize,
  methods: {select, redeem},
  components: {organizationsDetails, communitiesMap}
};

function initialize() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities)
    .then(communities => {
      let query = (this.$route.query.community || '').toLowerCase().replace(/\s+/g, '');
      if (query) return this.community = communities.find(c => c.name.toLowerCase().replace(/\s+/g, '') === query) || communities[0];
      return this.community = communities[0];
    });
}

function select(organization) {
  var hours = this.$http.get(`/organizations/${organization.id}/hours`).then(response => response.data);
  var promotions = this.$http.get(`/organizations/${organization.id}/promotions`).then(response => response.data);
  return Promise.all([hours, promotions]).then(values => {
    this.selected = {...organization, hours: values[0], promotions: values[1]};
    if (!this.selected.promotions.length) this.active = 'general';
    this.sidebar = true;
  });
}

function redeem(promotion) {
  this.submitting = false;
  return this.$http.post(`/promotions/${promotion.id}/redeem`)
    .then(() => this.successful = true)
    .catch(({data, status}) => {
      this.error = true;
      if (status == 401) {
        this.msg = 'you must login to access this peragrin feature';
      } else if (data && data.msg) {
        this.msg = data.msg;
      } else {
        this.msg = 'unknown error';
      }
    })
    .then(() => this.submitting = false);
}
</script>

<style lang="stylus">
.map {
  .leaflet-container {
    position: fixed;
    height: 100% !important;
    z-index: 1;
    top: 53px;
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
