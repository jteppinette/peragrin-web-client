<template>
<form @keyup.enter="register" class="pa-3">
  <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
  <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
  <v-select v-model="role" :items="roles" prepend-icon="account_box" label="Select your role" :disabled="locked" light single-line auto />
  <v-btn @click.native="register" block primary>Register</v-btn>
  <p class="pt-2 text-xs-center"><router-link to="/login">If you already have an account, then click here to login.</router-link></p>
</form>
</template>

<script>
import jwtDecode from 'jwt-decode';

const ROLE_LOOKUP = {
  p: 'Patron',
  b: 'Business Leader',
  c: 'Community Leader'
};

export default {
  data: () => ({email: '', password: '', role: ROLE_LOOKUP['p'], roles: Object.keys(ROLE_LOOKUP).map(key => ROLE_LOOKUP[key]), locked: false}),
  methods: {register},
  mounted
};

function mounted() {
  if (this.$route.query.role) {
    this.role = ROLE_LOOKUP[this.$route.query.role];
    this.locked = true;
  }
}

function register() {
  return this.$http.post('/register', {email: this.email, password: this.password})
    .then(response => response.json())
    .then(function({token}) {
      var {mapboxAPIKey, id, email} = jwtDecode(token);
      sessionStorage.token = token;
      sessionStorage.mapboxAPIKey = mapboxAPIKey;
      sessionStorage.userID = id;
      sessionStorage.email = email;
    })
    .then(() => this.$router.push('/overview'));
}
</script>

<style lang="stylus">
.input-group__selections__comma {
  margin-left: 10px;
}
</style>
