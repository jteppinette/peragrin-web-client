<template>
<v-list two-line>
  <v-list-tile v-for="promotion in organization.promotions" @click.native.stop="dialogs.redeem[promotion.id] = !dialogs.redeem[promotion.id]" v-if="promotion && promotion.name" :key="promotion.name">

    <v-list-tile-action>
      <v-icon medium class="primary--text" v-if="promotion.redeemed">check_circle</v-icon>
      <v-icon medium v-else v-badge="{overlap: true, value: promotion.redemptions ? promotion.redemptions.length : 0, right: true, visible: promotion.redemptions && promotion.redemptions.length}">fullscreen</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title class="pt-3">{{ promotion.name }}</v-list-tile-title>
      <v-list-tile-sub-title>{{ promotion.description }}</v-list-tile-sub-title>
    </v-list-tile-content>

    <v-snackbar vertical secondary v-model="promotion.redeemed">The promotion, {{ promotion.name }} from {{ organization.name }} has been successfully redeemed.</v-snackbar>

    <v-dialog lazy v-model="dialogs.redeem[promotion.id]" width="600px" scrollable persistent>
      <v-card>

        <v-card-title class="primary title">{{ promotion.name }}</v-card-title>

        <v-card-text class="pa-0">

          <v-card-text class="secondary">{{ promotion.description }}</v-card-text>
          <v-card-text class="warning" v-if="promotion.redemptions && promotion.redemptions.length">This promotion has been redeemed <strong>{{ promotion.redemptions.length }} times</strong>. The last redemption was <strong>{{ promotion.redemptions[0].consumedAt | moment("from", true) }} ago</strong>.</v-card-text>

          <v-snackbar v-if="dialogs.redeem[promotion.id]" v-model="error" error>{{ msg }}
            <v-btn flat @click.native="error = false" class="white--text">close</v-btn>
          </v-snackbar>

          <v-card-text>Show this screen to an employee of {{ organization.name }}. After they acknowledge the promotion, you can have them click 'Redeem' button below. Provided you are able to receive this promotion, the promotion will be accepted.</v-card-text>

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

        </v-card-text>

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
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  methods: {redeem, initializeDialogs, initializeRedemptions},
  mounted: initialize
};

function initialize() {
  return Promise.all([
    this.initializeDialogs(),
    this.initializeRedemptions()
  ]);
}

function initializeDialogs() {
  return this.dialogs.redeem = this.organization.promotions.reduce((obj, promotion) => {
    return {...obj, [promotion.id]: false};
  }, {});
}

function initializeRedemptions() {
  if (!this.account) return;
  let promises = this.organization.promotions.map(promotion => {
    return this.$http.get(`/accounts/${this.account.id}/promotions/${promotion.id}`)
      .then(({data: redemptions}) => this.$set(promotion, 'redemptions', redemptions));
  });
  return Promise.all(promises);
}

function redeem(promotion) {
  this.submitting = false;
  return this.$http.post(`/promotions/${promotion.id}/redeem`)
    .then(() => this.$set(promotion, 'redeemed', true))
    .then(() => this.dialogs.redeem[promotion.id] = false)
    .then(() => this.submitting = false)
    .then(this.initializeRedemptions)
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
