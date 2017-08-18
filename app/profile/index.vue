<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Profile</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout v-if="account && account.isSuper" row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title class="secondary title">You are currently authenticated as a super user.</v-card-title>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap>

    <v-flex xs12 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Update Account</v-card-title>
        <form @submit.prevent="updateAccount" novalidate>
          <v-card-text>
            <v-text-field v-model="email" :error="errors.account" type="email" label="Email"></v-text-field>
            <v-text-field v-model="firstName" :error="errors.account" type="text" label="First Name"></v-text-field>
            <v-text-field v-model="lastName" :error="errors.account" type="text" label="Last Name"></v-text-field>
          </v-card-text>
          <v-card-actions class="secondary">
            <v-spacer></v-spacer>
            <v-btn outline class="white--text" :error="errors.account" :loading="submitting.account" type="submit">Update</v-btn>
          </v-card-actions>
          <v-snackbar v-model="errors.account" error>{{ messages.account }}
            <v-btn flat @click="errors.account = false" class="white--text">Close</v-btn>
          </v-snackbar>
        </form>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Set Password</v-card-title>
        <v-alert error dismissible v-model="errors.password">{{ messages.password }}</v-alert>
        <form @submit.prevent="setPassword" novalidate>
          <v-card-text>
            <v-text-field v-model="password" :error="errors.password" prepend-icon="lock" type="password" label="Password"></v-text-field>
          </v-card-text>
          <v-card-actions class="secondary">
            <v-spacer></v-spacer>
            <v-btn outline class="white--text" :error="errors.password" :loading="submitting.password" type="submit">Set</v-btn>
          </v-card-actions>
          <v-snackbar v-model="errors.password" error>{{ messages.password }}
            <v-btn flat @click="errors.password = false" class="white--text">Close</v-btn>
          </v-snackbar>
        </form>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Memberships</v-card-title>
        <v-list v-if="communities && communities.length" two-line>
          <template v-for="community in communities">
            <v-subheader>{{ community.name }}</v-subheader>
            <v-list-tile v-for="membership in community.memberships" :key="membership.id">
              <v-list-tile-content>
                <v-list-tile-title>{{ membership.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ membership.description }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-card-text v-if="communities && !communities.length" class="secondary expose">
          <p>Your account does not have any memberships.</p>
          <p>Reach out to us at <a href="mailto:support@peragrin.com?subject=Memberships">support@peragrin.com</a> or contact a community leader near you to start a membership.</p>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Redemptions</v-card-title>
        <v-list v-if="redemptions && redemptions.length" two-line>
          <v-list-tile v-for="redemption in redemptions" :key="redemption.consumedAt">
            <v-list-tile-content>
              <v-list-tile-title>{{ redemption.promotion.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ redemption.consumedAt | moment("from") }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-card-text v-if="redemptions && !redemptions.length" class="secondary expose">
          <p>Your account does not have any redemptions.</p>
          <p>You can redeem promotions by visiting a community map <a to="/map">here</a>.</p>
        </v-card-text>
      </v-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
let errors = {
  account: false,
  password: false
};

let messages = {
  account: '',
  password: ''
};

let submitting = {
  account: false,
  password: false
};

export default {
  data: () => ({redemptions: undefined, communities: undefined, firstName: '', lastName: '', email: '', password: '', submitting, errors, messages}),
  methods: {initializeMemberships, initializeRedemptions, updateAccount, setPassword},
  mounted: initialize,
  computed: {
    account () {
      return this.$store.state.account;
    }
  }
};

function initialize() {
  this.email = this.$store.state.account.email;
  this.firstName = this.$store.state.account.firstName;
  this.lastName = this.$store.state.account.lastName;
  return Promise.all([this.initializeMemberships(), this.initializeRedemptions()]);
}

function initializeMemberships() {
  return this.$http.get(`/accounts/${this.account.id}/memberships`)
    .then(({data: communities}) => this.communities = communities);
}

function initializeRedemptions() {
  return this.$http.get(`/accounts/${this.account.id}/promotions`)
    .then(({data: redemptions}) => this.redemptions = redemptions);
}

function updateAccount() {
  this.submitting.account = true;
  return this.$store.dispatch('update', {email: this.email, firstName: this.firstName, lastName: this.lastName})
    .catch(({data}) => this.errors.account = !!(this.messages.account = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting.account = false);
}

function setPassword() {
  this.submitting.password = true;
  return this.$http.post('/auth/set-password', {password: this.password})
    .catch(({data}) => this.errors.password = !!(this.messages.password = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting.password = false);
}
</script>
