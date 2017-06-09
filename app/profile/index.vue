<template>
<v-container fluid class="pa-3">
  <v-layout row wrap>

    <v-flex xs12 sm8 md6 lg4>
      <v-card>
        <v-card-title class="primary">Account</v-card-title>
        <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
        <v-container fluid>
          <form @submit.prevent="update" novalidate>
            <v-text-field v-model="email" :error="error" prepend-icon="mail" type="email" label="Email"></v-text-field>
            <v-text-field v-model="password" :error="error" prepend-icon="lock" type="password" label="Password"></v-text-field>
            <v-btn type="submit" class="white--text" block primary>Update Account</v-btn>
          </form>
        </v-container>
      </v-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
export default {
  data: () => ({email: '', password: '', success: false, error: false, msg: ''}),
  methods: {update},
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function update() {
  return this.$store.dispatch('update', {email: this.email, password: this.password})
    .then(() => this.success = true)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
