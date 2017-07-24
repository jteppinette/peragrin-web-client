<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Profile</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout v-if="account && account.isSuper" row wrap>
    <v-flex xs12>
      <v-alert v-model="account.isSuper" info>You are currently authenticated as a super user.</v-alert>
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
            <v-btn flat @click.native="errors.account = false" class="white--text">Close</v-btn>
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
            <v-btn flat @click.native="errors.password = false" class="white--text">Close</v-btn>
          </v-snackbar>
        </form>
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
  data: () => ({firstName: '', lastName: '', email: '', password: '', submitting, errors, messages}),
  methods: {updateAccount, setPassword},
  mounted: initialize,
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function initialize() {
  return this.$store.dispatch('initialize')
    .then(() => {
      this.email = this.$store.state.account.email;
      this.firstName = this.$store.state.account.firstName;
      this.lastName = this.$store.state.account.lastName;
    });
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
