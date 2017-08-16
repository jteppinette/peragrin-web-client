<template>
<div>

  <form v-if="!success" @submit.prevent="register" class="pa-3" novalidate>

    <v-text-field v-model="email" :error="error" type="email" label="Email"></v-text-field>
    <v-text-field v-model="firstName" :error="error" type="text" label="First Name"></v-text-field>
    <v-text-field v-model="lastName" :error="error" type="text" label="Last Name"></v-text-field>
    <v-btn type="submit" class="white--text" :error="error" block primary :loading="submitting">Register</v-btn>

    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/login">If you already have an account, then click here to login.</router-link></p>

    <v-snackbar v-model="error" error>{{ msg }}
      <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
    </v-snackbar>

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
  data: () => ({submitting: false, email: '', firstName: '', lastName: '', success: false, error: false, msg: ''}),
  methods: {register}
};

function register() {
  this.submitting = true;
  return this.$http.post('/auth/register', {email: this.email, firstName: this.firstName, lastName: this.lastName})
    .then(() => this.success = true)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
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
