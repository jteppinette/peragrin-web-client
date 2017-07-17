<template>
<v-dialog v-model="value" width="800px" scrollable persistent>
  <v-card>
    <v-card-title class="primary title">{{ action.name }} Organization</v-card-title>
    <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
    <form @submit.prevent="action.method" novalidate>
      <v-card-text>
        <organizations-form v-model="data"></organizations-form>
        <organizations-hours v-model="data.hours"></organizations-hours>
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
import organizationsForm from 'common/organizations/form';
import organizationsHours from 'common/organizations/hours';

export default {
  props: ['organization', 'communityID', 'value'],
  data: () => ({msg: '', error: false}),
  components: {organizationsForm, organizationsHours},
  computed: {
    action () {
      return this.organization ? {name: 'Update', method: this.update, icon: 'edit'} : {name: 'Create', method: this.create, icon: 'add'};
    },
    data () {
      return this.organization ? JSON.parse(JSON.stringify(this.organization)) : {
        name: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        email: '',
        phone: '',
        website: '',
        hours: [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}],
        category: ''
      };
    }
  },
  methods: {create, update}
};

function update() {
  return this.$http.post(`/organizations/${this.organization.id}`, this.data)
    .then(response => response.json())
    .then(organization => this.$emit('updated', {...this.organization, ...organization}))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function create() {
  return this.$http.post(`/communities/${this.communityID}/organizations`, this.data)
    .then(response => response.json())
    .then(organization => this.$emit('created', organization))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
