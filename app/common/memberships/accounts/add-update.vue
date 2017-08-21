<template>
<v-dialog v-model="value" width="600px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">{{ action.name }} {{ membership.name }} Account</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <v-text-field v-model="data.email" :disabled="!!account" @keyup="search" :error="error" label="Email"></v-text-field>
        <v-text-field v-model="data.firstName" :disabled="exists" :error="error" label="First Name"></v-text-field>
        <v-text-field v-model="data.lastName" :disabled="exists" :error="error" label="Last Name"></v-text-field>

        <v-menu lazy style="width: 100%">
          <v-text-field slot="activator" label="Expiration" :value="data.expiration | moment('from')" readonly></v-text-field>
          <v-date-picker @input="v => data.expiration = new Date(v)" :value="expirationRepresentation" autosave></v-date-picker>
        </v-menu>

        <div v-if="action.name == 'Add'">
          <p v-if="exists" class="subheading">This pre-existing account will not receive an activation email after being added to this membership.</p>
          <p v-else class="subheading">Upon creation, this account will receive an email to activate their account.</p>
        </div>
      </v-card-text>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">{{ action.name }}</v-btn>
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
  props: ['account', 'membership', 'value'],
  data: () => ({submitting: false, msg: '', error: false, data: {}, exists: false}),
  computed: {
    action () {
      return this.account ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Add', method: this.add, icon: 'add'};
    },
    expirationRepresentation () {
      let date = new Date(this.data.expiration);
      date.setDate(date.getDate() + 1);
      return date;
    }
  },
  mounted: initialize,
  methods: {update, add, search: _.debounce(search, 250)}
};

function initialize() {
  this.data = this.account ? JSON.parse(JSON.stringify(this.account)) : {
    email: '',
    firstName: '',
    lastName: '',
    expiration: new Date(new Date().setFullYear(new Date().getFullYear() +1))
  };
}

function update() {
  this.submitting = true;
  return this.$http.put(`/memberships/${this.membership.id}/accounts/${this.account.id}`, this.data)
    .then(({data: account}) => this.$emit('updated', account))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function add() {
  this.submitting = true;
  return this.$http.post(`/memberships/${this.membership.id}/accounts`, this.data)
    .then(({data: account}) => this.$emit('added', account))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function search() {
  if (!this.data.email) clear.call(this);
  return this.$http.get(`/accounts?email=${this.data.email}`)
    .then(({data: {results: accounts}}) => {
      if (!accounts.length) return clear.call(this);
      this.data = {...accounts[0], expiration: this.data.expiration};
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
