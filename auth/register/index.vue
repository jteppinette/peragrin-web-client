<template>
<div>
  <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
  <form @submit.prevent="register" class="pa-3" novalidate>
    <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
    <v-select v-model="next" :error="error" :items="roles" prepend-icon="account_box" label="Select your role" :disabled="locked" item-text="name" item-value="next" single-line auto />
    <v-btn type="submit" class="white--text" block primary>Register</v-btn>
    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/login">If you already have an account, then click here to login.</router-link></p>
  </form>
</div>
</template>

<script>
const PATRON = {key: 'p', next: '/map', name: 'Patron'},
      BUSINESS_LEADER = {key: 'b', next: '/setup/business-leader', name: 'Business Leader'},
      COMMUNITY_LEADER = {key: 'c', next: '/setup/community-leader', name: 'Community Leader'};

const ROLES = [PATRON, BUSINESS_LEADER, COMMUNITY_LEADER];

export default {
  data: () => ({email: '', password: '', next: PATRON.next, roles: ROLES, locked: false, error: false, msg: ''}),
  methods: {register},
  mounted: initialize
};

function initialize() {
  if (this.$route.query.role) {
    this.next = ROLES.find(e => e.key === this.$route.query.role).next;
    this.locked = true;
  }
}

function register() {
  return this.$store.dispatch('register', {email: this.email, password: this.password})
    .then(() => this.$router.push(this.next))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
