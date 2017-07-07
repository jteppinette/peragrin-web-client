<template>
<v-dialog v-model="dialog" width="800px" scrollable persistent>
  <v-btn floating slot="activator" class="white"><v-icon dark>{{ action.icon }}</v-icon></v-btn>
  <v-card>
    <v-card-title class="primary">{{ action.name }}  Organization</v-card-title>
    <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
    <form @submit.prevent="action.method" novalidate>
      <v-card-row>
        <v-card-text>
          <organization-form v-model="data"></organization-form>
          <organization-hours v-model="data.hours"></organization-hours>
        </v-card-text>
      </v-card-row>
      <v-card-row actions class="primary">
        <v-btn flat class="white--text" @click.native="dialog = false">Close</v-btn>
        <v-btn outline light type="submit">{{ action.name }} Organization</v-btn>
      </v-card-row>
    </form>
  </v-card>
</v-dialog>
</template>
<script>
import organizationForm from 'common/organization/form';
import organizationHours from 'common/organization/hours';

export default {
  props: ['organization', 'communityID'],
  data: () => ({msg: '', error: false, dialog: false}),
  components: {organizationForm, organizationHours},
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
    .then(() => this.dialog = false)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function create() {
  return this.$http.post(`/communities/${this.communityID}/organizations`, this.data)
    .then(response => response.json())
    .then(organization => this.$emit('created', organization))
    .then(() => this.dialog = false)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>
