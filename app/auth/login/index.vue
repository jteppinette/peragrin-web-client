<template>
<form @keyup.enter="login" class="pa-3">
  <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
  <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
  <v-btn @click.native="login" class="white--text" block primary>Login</v-btn>
  <p class="pt-2 text-xs-center"><router-link to="/auth/register">If you do not have an account, then click here to register.</router-link></p>
</form>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data: () => ({email: '', password: ''}),
  methods: {login}
};

function login() {
  return this.$http.post('/auth/login', {email: this.email, password: this.password})
    .then(response => response.json())
    .then(function({token}) {
      var {id, email, organizationID} = jwtDecode(token);
      sessionStorage.token = token;
      sessionStorage.userID = id;
      sessionStorage.email = email;
    })
    .then(() => this.$http.get('/auth/organizations'))
    .then(response => response.json())
    .then(organizations => organizations.length ? '/console/overview' : '/client')
    .then(root => this.$router.push(this.$route.query.next || root));
}
</script>
