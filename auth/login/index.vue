<template>
<form @keyup.enter="login" class="pa-3">
  <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
  <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
  <v-btn @click.native="login" class="white--text" block primary>Login</v-btn>
  <p class="pt-2 text-xs-center"><router-link to="/auth/register">If you do not have an account, then click here to register.</router-link></p>
</form>
</template>

<script>
export default {
  data: () => ({email: '', password: ''}),
  methods: {login}
};

function login() {
  return this.$store.dispatch('login', {email: this.email, password: this.password})
    .then(({organizations}) => organizations && organizations.length ? '/overview' : '/map')
    .then(root => this.$router.push(this.$route.query.next || root));
}
</script>
