<template>
<div>
  <form @submit.prevent="activate" class="pa-3" novalidate>

    <v-text-field v-model="account.email" :error="error" prepend-icon="mail" type="email" label="Email" disabled></v-text-field>
    <v-select v-if="!next" v-model="role" item-text="name" return-object :error="error" :items="roles" prepend-icon="account_box" label="Select your role" single-line auto />
    <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
    <v-text-field v-model="confirm" :error="error" :rules="[() => (password && confirm) && (password !== confirm) ? 'Your passwords do not match.' : true]" prepend-icon="check" type="password" label="Confirm Password"></v-text-field>
    <v-btn type="submit" class="white--text" block primary :error="error" :loading="submitting" :disabled="!password || !confirm || password !== confirm">Activate</v-btn>

    <v-snackbar v-model="error" error>{{ msg }}
      <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
    </v-snackbar>

  </form>
</div>
</template>

<script>
import jwtDecode from 'jwt-decode';

const PATRON = {key: 'p', next: '/map', name: 'Patron'},
      BUSINESS_LEADER = {key: 'b', next: '/setup/business-leader', name: 'Business Leader'},
      COMMUNITY_LEADER = {key: 'c', next: '/setup/community-leader', name: 'Community Leader'};

const ROLES = [PATRON, BUSINESS_LEADER, COMMUNITY_LEADER];

export default {
  data: () => ({submitting: false, password: '', next: '', role: PATRON, roles: ROLES, confirm: '', token: '', error: false, msg: ''}),
  computed: {
    account () {
      if (this.$route.query.token) {
        return {...jwtDecode(this.$route.query.token), token: this.$route.query.token};
      }
      return {};
    }
  },
  mounted: initialize,
  methods: {activate}
};

function initialize() {
  if (this.$route.query.next) {
    this.next = this.$route.query.next;
  }
}

function activate() {
  this.submitting = true;
  return this.$store.dispatch('activate', {password: this.password, token: this.account.token})
    .then(() => this.$router.push(this.next || this.role.next))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
