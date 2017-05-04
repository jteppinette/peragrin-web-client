<template>
<form @keyup.enter="register" class="pa-3">
  <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
  <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
  <v-btn @click.native="register" block primary>Register</v-btn>
  <p class="pt-2 text-xs-center"><router-link to="/login">If you already have an account, then click here to login.</router-link></p>
</form>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data: () => ({email: '', password: ''}),
  methods: {register}
};

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
