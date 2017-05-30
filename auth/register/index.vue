<template>
<form @keyup.enter="register" class="pa-3">
  <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
  <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
  <v-select v-model="next" :items="roles" prepend-icon="account_box" label="Select your role" :disabled="locked" item-text="name" item-value="next" single-line auto />
  <v-btn @click.native="register" class="white--text" block primary>Register</v-btn>
  <p class="pt-2 text-xs-center"><router-link to="/auth/login">If you already have an account, then click here to login.</router-link></p>
</form>
</template>

<script>
const PATRON = {key: 'p', next: '/map', name: 'Patron'},
      BUSINESS_LEADER = {key: 'b', next: '/setup/business-leader', name: 'Business Leader'},
      COMMUNITY_LEADER = {key: 'c', next: '/setup/community-leader', name: 'Community Leader'};

const ROLES = [PATRON, BUSINESS_LEADER, COMMUNITY_LEADER];

export default {
  data: () => ({email: '', password: '', next: PATRON.next, roles: ROLES, locked: false}),
  methods: {register},
  mounted
};

function mounted() {
  if (this.$route.query.role) {
    this.next = ROLES.find(e => e.key === this.$route.query.role).next;
    this.locked = true;
  }
}

function register() {
  return this.$store.dispatch('register', {email: this.email, password: this.password})
    .then(() => this.$router.push(this.next));
}
</script>
