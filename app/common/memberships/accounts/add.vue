<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">Add {{ membership.name }} Account</v-card-title>
    <form @submit.prevent="add" novalidate>

      <v-card-text>
        <v-text-field v-model="account.email" :error="error" label="Email"></v-text-field>
        <v-text-field v-model="account.firstName" :error="error" label="First Name"></v-text-field>
        <v-text-field v-model="account.lastName" :error="error" label="Last Name"></v-text-field>
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
let account = {
  email: '',
  firstName: '',
  lastName: ''
};

export default {
  props: ['membership', 'value'],
  data: () => ({submitting: false, msg: '', error: false, account}),
  methods: {add}
};

function add() {
  this.submitting = true;
  return this.$http.post(`/memberships/${this.membership.id}/accounts`, this.account)
    .then(({data: account}) => this.$emit('success', account))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
