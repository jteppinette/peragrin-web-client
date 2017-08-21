<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">{{ action.name }} Membership</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <v-text-field v-model="data.name" :error="error" label="Name"></v-text-field>
        <v-text-field v-model="data.description" :error="error" label="Description" rows="1" multi-line></v-text-field>
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

export default {
  props: ['membership', 'communityID', 'value'],
  data: () => ({submitting: false, msg: '', error: false, data: {}}),
  computed: {
    action () {
      return this.membership ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    }
  },
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  },
  methods: {initialize, create, update}
};

function initialize() {
  this.submitting = false;
  this.msg = '';
  this.error = false;
  this.data = this.membership ? JSON.parse(JSON.stringify(this.membership)) : {name: '', description: ''};
}

function update() {
  this.submitting = true;
  return this.$http.put(`/memberships/${this.membership.id}`, this.data)
    .then(({data: membership}) => this.$emit('updated', membership))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function create() {
  this.submitting = true;
  return this.$http.post(`/communities/${this.communityID}/memberships`, this.data)
    .then(({data: membership}) => this.$emit('created', membership))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
