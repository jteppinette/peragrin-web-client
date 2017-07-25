<template>
<v-navigation-drawer hide-overlay temporary right v-model="organization">
  <v-card flat img>

    <v-card-title class="primary headline">{{ organization.name }}</v-card-title>

    <v-card-text v-if="organization.category" class="secondary">
      <v-chip outline class="ma-0 white--text">{{ organization.category }}</v-chip>
    </v-card-text>

    <v-card-media v-if="organization.logoURL" :src="organization.logoURL" height="130px"></v-card-media>

    <v-tabs grow dark :scrollable="false" v-model="active" class="tabs-no-border">

      <!-- BAR -->
      <v-tabs-bar slot="activators" class="secondary">
        <v-tabs-item ripple href="#general">General</v-tabs-item>
        <v-tabs-item ripple href="#promotions" v-if="organization.promotions && organization.promotions.length">Promotions</v-tabs-item>
      </v-tabs-bar>

      <!-- GENERAL -->
      <v-tabs-content id="general"><organizations-details :organization="organization"></organizations-details></v-tabs-content>

      <!-- PROMOTIONS -->
      <v-tabs-content id="promotions">
        <v-expansion-panel class="elevation-0">
          <v-expansion-panel-content v-for="promotion in organization.promotions" :key="promotion.name">
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
</template>

<script>
import organizationsDetails from 'common/organizations/details';

export default {
  props: ['organization'],
  data: () => ({successful: false, submitting: false, active: undefined, msg: '', error: undefined}),
  methods: {redeem},
  components: {organizationsDetails}
};

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

<style scoped lang="stylus">
.navigation-drawer {
  z-index: 7 !important;
  border: 0;
  padding: 0px;

  &.navigation-drawer--open {
    width: 400px !important;
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
