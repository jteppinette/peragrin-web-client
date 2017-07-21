<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">Add {{ organization.name }} Operator</v-card-title>
    <form @submit.prevent="add" novalidate>

      <v-card-text>
        <v-text-field v-model="account.email" @keyup.native="search" :error="error" label="Email"></v-text-field>
        <v-text-field v-model="account.firstName" :disabled="exists" :error="error" label="First Name"></v-text-field>
        <v-text-field v-model="account.lastName" :disabled="exists" :error="error" label="Last Name"></v-text-field>

        <p v-if="exists" class="subheading">This pre-existing account will not receive an activation email after being added to this organization.</p>
        <p v-else class="subheading">Upon creation, this account will receive an email to activate their account.</p>
      </v-card-text>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click.native="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">Add</v-btn>
      </v-card-actions>

      <v-snackbar v-if="value" v-model="error" error>{{ msg }}
        <v-btn flat @click.native="error = false" class="white--text">Close</v-btn>
      </v-snackbar>

    </form>
  </v-card>
</v-dialog>
</template>
<script>
import _ from 'lodash';

let account = {
  email: '',
  firstName: '',
  lastName: ''
};

export default {
  props: ['organization', 'value'],
  data: () => ({submitting: false, msg: '', error: false, account, exists: false}),
  methods: {add, search: _.debounce(search, 250)}
};

function add() {
  this.submitting = true;
  return this.$http.post(`/organizations/${this.organization.id}/accounts`, this.account)
    .then(({data: account}) => this.$emit('success', account))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function search() {
  if (!this.account.email) clear.call(this);
  return this.$http.get(`/accounts?email=${this.account.email}`)
    .then(({data: {results: accounts}}) => {
      if (!accounts.length) return clear.call(this);
      this.account = accounts[0];
      this.exists = true;
    })
    .catch(clear);

  function clear() {
    this.account.firstName = '';
    this.account.lastName = '';
    this.exists = false;
  }
}
</script>
