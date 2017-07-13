<template>
<div>
  <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
  <form @submit.prevent="set" class="pa-3" novalidate>
    <v-text-field v-model="account.email" :error="error" prepend-icon="mail" type="email" label="Email" disabled></v-text-field>
    <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
    <v-text-field v-model="confirm" :error="error" :rules="[() => (password && confirm) && (password !== confirm) ? 'Your passwords do not match.' : true]" prepend-icon="check" type="password" label="Confirm Password"></v-text-field>
    <v-btn type="submit" class="white--text" block primary :disabled="!password || !confirm || password !== confirm">Set Password</v-btn>
  </form>
</div>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data: () => ({password: '', confirm: '', token: '', error: false, msg: ''}),
  computed: {
    account () {
      if (this.$route.query.token) {
        return {...jwtDecode(this.$route.query.token), token: this.$route.query.token};
      }
      return {};
    }
  },
  methods: {set}
};

function set() {
  return this.$http.post('/auth/account', {password: this.password}, {headers: {Authorization: `Bearer ${this.account.token}`}})
    .then(root => this.$router.push('/auth/login'))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
