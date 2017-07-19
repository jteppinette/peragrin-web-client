<template>
<div>

  <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
  <form v-if="!success" @submit.prevent="register" class="pa-3" novalidate>
    <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
    <v-btn type="submit" class="white--text" block primary>Register</v-btn>
    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/login">If you already have an account, then click here to login.</router-link></p>
  </form>

  <v-card v-if="success">
    <v-card-title class="title secondary white--text">Success!</v-card-title>
    <v-card-text>
      <p class="subheading">Your account has been created. You have been sent an account activation email at {{ email }}. Click the link in the email to activate and setup your account.</p>
    </v-card-text>
  </v-card>

</div>
</template>

<script>
export default {
  data: () => ({email: '', success: false, error: false, msg: ''}),
  methods: {register}
};

function register() {
  return this.$http.post('/auth/register', {email: this.email})
    .then(() => this.success = true)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>

<style lang="stylus" scoped>
.card {

  >:first-child {
    border-top-left-radius: initial;
    border-top-right-radius: initial;
  }

  .card__text {
    max-width: 500px;
  }
}
</style>
