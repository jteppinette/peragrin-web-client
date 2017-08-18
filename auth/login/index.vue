<template>
<div>
  <form @submit.prevent="login" class="pa-3" novalidate>

    <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
    <v-btn type="submit" class="white--text" :error="error" :loading="submitting" block primary>Login</v-btn>

    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/register">If you do not have an account, then click here to register.</router-link></p>
    <v-divider></v-divider>
    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/forgot-password">If you forgot your password, then click here to request a password reset email.</router-link></p>

    <v-snackbar v-model="error" error>{{ msg }}
      <v-btn flat @click="error = false" class="white--text">close</v-btn>
    </v-snackbar>

  </form>
</div>
</template>

<script>
export default {
  data: () => ({submitting: false, email: '', password: '', error: false, msg: ''}),
  methods: {login}
};

function login() {
  this.submitting = true;
  return this.$store.dispatch('login', {email: this.email, password: this.password})
    .then(account => Promise.all([
      new Promise(r => r(account)),
      this.$http.get(`/accounts/${account.id}/organizations`).then(({data: organizations}) => organizations.map(o => o.id)),
      this.$http.get(`/accounts/${account.id}/communities?isAdministrator=true`).then(({data: communities}) => communities.map(c => c.id))
    ]))
    .then(([account, organizations, communities]) => {
      this.$store.commit('setOrganizations', organizations);
      this.$store.commit('setCommunities', communities);
      if (account.isSuper || communities.length) {
        return '/communities';
      } else if (organizations.length) {
        return '/organizations';
      } else {
        return '/map';
      }
    })
    .then(root => this.$router.push(this.$route.query.next || root))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
