<template>
<div>

  <form v-if="!success" @submit.prevent="requestPasswordResetEmail" class="pa-3" novalidate>

    <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
    <v-btn type="submit" class="white--text" :loading="submitting" :error="error" block primary>Request Reset Password Email</v-btn>

    <p class="pt-2 text-xs-center"><router-link class="black--text" to="/auth/login">If you know your password, then click here to login.</router-link></p>

    <v-snackbar v-model="error" error>{{ msg }}
      <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
    </v-snackbar>

  </form>

  <v-card v-if="success">
    <v-card-title class="title secondary white--text">Success!</v-card-title>
    <v-card-text>
      <p class="subheading">You have been sent an account activation email at {{ email }}. Click the link in the email to reset your password.</p>
    </v-card-text>
  </v-card>

</div>
</template>

<script>
export default {
  data: () => ({success: false, submitting: false, email: '', error: false, msg: ''}),
  methods: {requestPasswordResetEmail}
};

function requestPasswordResetEmail() {
  this.submitting = true;
  return this.$http.post('/auth/forgot-password', {email: this.email})
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
