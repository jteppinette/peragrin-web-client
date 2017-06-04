<template>
<v-container fluid class="pa-3">
  <v-layout row wrap>

    <v-flex xs12>
      <v-card>
        <v-card-title class="primary">Account</v-card-title>
        <form @keyup.enter="login" class="pa-3">
          <v-text-field v-model="email" prepend-icon="mail" type="email" label="Email"></v-text-field>
          <v-text-field v-model="password" prepend-icon="lock" type="password" label="Password"></v-text-field>
          <v-btn @click.native="update" class="white--text" block primary>{{ success ? 'Success - Account Updated' : 'Update Account' }}</v-btn>
        </form>
      </v-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
export default {
  data: () => ({email: '', password: '', success: false}),
  methods: {update},
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function update() {
  return this.$store.dispatch('update', {email: this.email, password: this.password})
    .then(() => this.success = true);
}
</script>

<style scoped lang="stylus">
.card {
  max-width: 400px;
}
</style>
