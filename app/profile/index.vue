<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Profile</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap>

    <v-flex xs12 sm8 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Account</v-card-title>
        <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
        <form @submit.prevent="update" novalidate>
          <v-card-text>
            <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
            <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn block primary type="submit">Update Account</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
export default {
  data: () => ({email: '', password: '', success: false, error: false, msg: ''}),
  methods: {update},
  mounted: initialize,
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function initialize() {
  return this.$store.dispatch('initialize')
    .then(({account}) => this.email = account.email);
}

function update() {
  return this.$store.dispatch('update', {email: this.email, password: this.password})
    .then(() => this.success = true)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
