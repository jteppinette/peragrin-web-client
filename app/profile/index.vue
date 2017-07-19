<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Profile</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap>

    <v-flex xs12 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Update Account</v-card-title>
        <v-alert error dismissible v-model="errors.update">{{ messages.update }}</v-alert>
        <form @submit.prevent="updateAccount" novalidate>
          <v-card-text>
            <v-text-field v-model="email" :error="errors.update" prepend-icon="mail" type="email" label="Email"></v-text-field>
          </v-card-text>
          <v-card-actions class="primary">
            <v-spacer></v-spacer>
            <v-btn outline class="white--text"  type="submit">Update</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 lg4>
      <v-card>
        <v-card-title class="primary title">Set Password</v-card-title>
        <v-alert error dismissible v-model="errors.password">{{ messages.password }}</v-alert>
        <form @submit.prevent="setPassword" novalidate>
          <v-card-text>
            <v-text-field v-model="password" :error="errors.password" prepend-icon="lock" type="password" label="Password"></v-text-field>
          </v-card-text>
          <v-card-actions class="primary">
            <v-spacer></v-spacer>
            <v-btn outline class="white--text"  type="submit">Set</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
let errors = {
  update: false,
  password: false
};

let messages = {
  update: '',
  password: ''
};

export default {
  data: () => ({email: '', password: '', errors, messages}),
  methods: {updateAccount, setPassword},
  mounted: initialize,
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function initialize() {
  return this.$store.dispatch('initialize')
    .then(() => this.email = this.$store.state.account.email);
}

function updateAccount() {
  return this.$store.dispatch('update', {email: this.email, password: this.password})
    .catch(({data}) => this.errors.update = !!(this.messages.update = data && data.msg ? data.msg : 'unknown error'));
}

function setPassword() {
  return this.$http.post('/auth/set-password', {password: this.password})
    .catch(({data}) => this.errors.password = !!(this.messages.password = data && data.msg ? data.msg : 'unknown error'));
}

</script>
