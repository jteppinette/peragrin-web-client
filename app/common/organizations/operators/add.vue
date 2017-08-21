<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">Add {{ organization.name }} Operator</v-card-title>
    <form @submit.prevent="add" novalidate>

      <v-card-text>
        <v-text-field v-model="data.email" @keyup="search" :error="error" label="Email"></v-text-field>
        <v-text-field v-model="data.firstName" :disabled="exists" :error="error" label="First Name"></v-text-field>
        <v-text-field v-model="data.lastName" :disabled="exists" :error="error" label="Last Name"></v-text-field>

        <p v-if="exists" class="subheading">This pre-existing account will not receive an activation email after being added to this organization.</p>
        <p v-else class="subheading">Upon creation, this account will receive an email to activate their account.</p>
      </v-card-text>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">Add</v-btn>
      </v-card-actions>

      <v-snackbar v-if="value" v-model="error" error>{{ msg }}
        <v-btn flat @click="error = false" class="white--text">Close</v-btn>
      </v-snackbar>

    </form>
  </v-card>
</v-dialog>
</template>
<script>
import _ from 'lodash';

export default {
  props: ['organization', 'value'],
  data: () => ({submitting: false, msg: '', error: false, data: {}, exists: false}),
  methods: {initialize, add, search: _.debounce(search, 250)},
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  }
};

function initialize() {
  this.submitting = false;
  this.msg = '';
  this.exists = false;
  this.data = {
    email: '',
    firstName: '',
    lastName: ''
  };
}

function add() {
  this.submitting = true;
  return this.$http.post(`/organizations/${this.organization.id}/accounts`, this.data)
    .then(({data: account}) => this.$emit('success', account))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function search() {
  if (!this.data.email || this.data.email == '') clear.call(this);
  return this.$http.get(`/accounts?email=${this.data.email}`)
    .then(({data: {results: accounts}}) => {
      if (!accounts.length) return clear.call(this);
      this.data = accounts[0];
      this.exists = true;
    })
    .catch(clear);

  function clear() {
    this.data.firstName = '';
    this.data.lastName = '';
    this.exists = false;
  }
}
</script>
