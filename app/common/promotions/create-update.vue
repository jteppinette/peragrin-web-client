<template>
<v-dialog v-model="value" width="400px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">{{ action.name }} Promotion</v-card-title>
    <form @submit.prevent="action.method" novalidate>

      <v-card-text>
        <v-text-field v-model="data.name" :error="error" label="Name"></v-text-field>
        <v-text-field v-model="data.description" :error="error" label="Description" rows="1" multi-line></v-text-field>
        <v-text-field v-model="data.exclusions" :error="error" label="Exclusions" rows="1" multi-line></v-text-field>

        <v-subheader v-if="communities.length" class="pa-0 pt-2" style="height: 0px">Required Community Memberships</v-subheader>
        <v-select v-if="communities.length" :items="communities" v-model="data.communities" itemText="name" itemValue="id" label="Communities" multiple chips single-line></v-select>
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
  props: ['promotion', 'communities', 'organizationID', 'value'],
  data: () => ({submitting: false, msg: '', error: false, data: {}}),
  methods: {initialize, create, update},
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  },
  computed: {
    action () {
      return this.promotion ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    }
  }
};

function initialize() {
  this.submitting = false;
  this.msg = '';
  this.error = false;
  this.data = this.promotion ? JSON.parse(JSON.stringify(this.promotion)) : {
    name: '',
    description: '',
    exclusions: '',
    membershipID: null
  };
}

function create() {
  this.submitting = true;
  return this.$http.post(`/organizations/${this.organizationID}/promotions`, this.data)
    .then(({data: promotion}) => this.$emit('created', promotion))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}

function update() {
  this.submitting = true;
  return this.$http.put(`/promotions/${this.promotion.id}`, this.data)
    .then(({data: promotion}) => this.$emit('updated', promotion))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
