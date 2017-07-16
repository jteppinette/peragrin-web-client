<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">{{ action.name }} Membership</v-card-title>
    <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
    <form @submit.prevent="action.method" novalidate>
      <v-card-text>
        <v-text-field v-model="data.name" :error="error" label="Name"></v-text-field>
        <v-text-field v-model="data.description" :error="error" label="Description" rows="1" multi-line></v-text-field>
      </v-card-text>
      <v-card-actions class="primary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click.native="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" type="submit">{{ action.name }}</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</v-dialog>
</template>
<script>

export default {
  props: ['membership', 'communityID', 'value'],
  data: () => ({msg: '', error: false}),
  computed: {
    action () {
      return this.membership ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    },
    data () {
      return this.membership ? JSON.parse(JSON.stringify(this.membership)) : {name: '', description: ''};
    }
  },
  methods: {create, update}
};

function update() {
  return this.$http.post(`/memberships/${this.membership.id}`, this.data)
    .then(response => response.json())
    .then(membership => this.$emit('updated', membership))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function create() {
  return this.$http.post(`/communities/${this.communityID}/memberships`, this.data)
    .then(response => response.json())
    .then(membership => this.$emit('created', membership))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
