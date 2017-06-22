<template>
<div>
  <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
  <form @submit.prevent="login" class="pa-3" novalidate>
    <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
    <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
    <v-btn type="submit" class="white--text" block primary>Login</v-btn>
    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/register">If you do not have an account, then click here to register.</router-link></p>
  </form>
</div>
</template>

<script>
export default {
  data: () => ({email: '', password: '', error: false, msg: ''}),
  methods: {login}
};

function login() {
  return this.$store.dispatch('login', {email: this.email, password: this.password})
    .then(({account}) => {
      if (!account.organizations || !account.organizations.length) {
        return '/map';
      } else if (account.organizations.find(o => o.communities ? o.communities.find(c => c.isAdministrator) : undefined)) {
        return '/communities';
      } else {
        return '/organizations';
      }
    })
    .then(root => this.$router.push(this.$route.query.next || root))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
