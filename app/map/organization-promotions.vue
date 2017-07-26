<template>
<v-list two-line>
  <v-list-tile v-for="promotion in organization.promotions" @click.native.stop="dialogs.redeem[promotion.id] = !dialogs.redeem[promotion.id]" v-if="promotion && promotion.name" :key="promotion.name">

    <v-list-tile-action v-if="promotion.redeemed"><v-icon medium class="primary--text">check_circle</v-icon></v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title class="pt-3">{{ promotion.name }}</v-list-tile-title>
      <v-list-tile-sub-title>{{ promotion.description }}</v-list-tile-sub-title>
    </v-list-tile-content>

    <v-snackbar secondary v-model="promotion.redeemed">The promotion, {{ promotion.name }} from {{ organization.name }} has been successfully redeemed.</v-snackbar>

    <v-dialog lazy v-model="dialogs.redeem[promotion.id]" width="600px" scrollable persistent>
      <v-card>

        <v-card-title class="primary title">{{ promotion.name }}</v-card-title>

        <v-card-text class="secondary subheading">{{ promotion.description }}</v-card-text>

        <v-snackbar v-if="dialogs.redeem[promotion.id]" v-model="error" error>{{ msg }}
          <v-btn flat @click.native="error = false" class="white--text">close</v-btn>
        </v-snackbar>

        <v-card-text>
          <p>Show this screen to an employee of {{ organization.name }}. After they acknowledge the promotion, you can have them click 'Redeem' button below. Provided you are able to receive this promotion, the promotion will be accepted.</p>
        </v-card-text>

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

        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn flat class="white--text" @click.native.stop="dialogs.redeem[promotion.id] = false">Close</v-btn>
          <v-btn outline class="white--text" :error="error" :loading="submitting" @click.native="redeem(promotion)">Redeem</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-list-tile>
</v-list>
</template>

<script>
let dialogs = {
  redeem: {}
};

export default {
  props: ['organization'],
  data: () => ({dialogs, submitting: false, msg: '', error: undefined}),
  methods: {redeem},
  mounted: initialize
};

function initialize() {
  this.dialogs.redeem = this.organization.promotions.reduce((obj, promotion) => {
    return {...obj, [promotion.id]: false};
  }, {});
}

function redeem(promotion) {
  this.submitting = false;
  return this.$http.post(`/promotions/${promotion.id}/redeem`)
    .then(() => this.$set(promotion, 'redeemed', true))
    .then(() => this.dialogs.redeem[promotion.id] = false)
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
