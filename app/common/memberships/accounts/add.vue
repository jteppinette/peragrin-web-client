<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">Add {{ membership.name }} Account</v-card-title>
    <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
    <form @submit.prevent="add" novalidate>
      <v-card-text>
        <v-text-field v-model="email" :error="error" label="Email"></v-text-field>
      </v-card-text>
      <v-card-actions class="primary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click.native="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" type="submit">Add</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</template>
<script>

export default {
  props: ['membership', 'value'],
  data: () => ({msg: '', error: false, email: ''}),
  methods: {add}
};

function add() {
  return this.$http.post(`/memberships/${this.membership.id}/accounts`, {email: this.email})
    .then(({data: account}) => this.$emit('success', account))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
