<template>
<div>
  <form @submit.prevent="set" class="pa-3" novalidate>

    <v-text-field v-model="account.email" :error="error" prepend-icon="mail" type="email" label="Email" disabled></v-text-field>
    <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
    <v-text-field v-model="confirm" :error="error" :rules="[() => (password && confirm) && (password !== confirm) ? 'Your passwords do not match.' : true]" prepend-icon="check" type="password" label="Confirm Password"></v-text-field>
    <v-btn type="submit" class="white--text" block primary :error="error" :loading="submitting" :disabled="!password || !confirm || password !== confirm">Set Password</v-btn>

    <v-snackbar v-model="error" error>{{ msg }}
      <v-btn flat @click="error = false" class="white--text">Close</v-btn>
    </v-snackbar>

  </form>
</div>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data: () => ({submitting: false, password: '', confirm: '', token: '', error: false, msg: ''}),
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
  this.submitting = true;
  return this.$http.post('/auth/set-password', {password: this.password}, {headers: {Authorization: `Bearer ${this.account.token}`}})
    .then(root => this.$router.push('/auth/login'))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
