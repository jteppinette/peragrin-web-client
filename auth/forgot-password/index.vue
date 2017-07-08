<template>
<div>
  <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
  <form @submit.prevent="requestPasswordResetEmail" class="pa-3" novalidate>
    <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
    <v-btn type="submit" class="white--text" block primary>Request Reset Password Email</v-btn>
    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/login">If you know your password, then click here to login.</router-link></p>
  </form>
</div>
</template>

<script>
export default {
  data: () => ({email: '', error: false, msg: ''}),
  methods: {requestPasswordResetEmail}
};

function requestPasswordResetEmail() {
  return this.$http.post('/auth/forgot-password', {email: this.email})
    .then(root => this.$router.push('/auth/login'))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
