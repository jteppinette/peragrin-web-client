<template>
<div>

  <v-dialog v-if="community.isAdministrator" v-model="dialog" width="800px" scrollable>
    <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
    <v-card>
      <v-card-title class="primary">Create Organization</v-card-title>
      <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
      <v-card-row>
        <v-card-text>
          <form @submit.prevent="create" novalidate>
            <organization-form v-model="organization"></organization-form>
            <organization-hours v-model="organization.hours"></organization-hours>

            <div class="right">
              <v-btn flat @click.native="dialog = false">Close</v-btn>
              <v-btn primary type="submit" class="white--text">Create Organization</v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card-row>
    </v-card>
  </v-dialog>

  <div class="pl-3 pr-3">
    <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
  </div>

  <v-data-table :headers="headers" :items="organizations" :search="search" class="no-limit-select">
    <template slot="items" scope="props">
      <td class="text-xs-right"><router-link :to="`/organizations/${props.item.id}`">{{ props.item.name }}</router-link></td>
      <td class="text-xs-right">{{ props.item.category }}</td>
      <td class="text-xs-right">
        <span>{{ props.item.street }}</span><br />
        <small>{{ props.item.city}} , {{ props.item.state }} {{ props.item.zip }}</small>
      </td>
    </template>
  </v-data-table>

</div>
</template>

<script>
import organizationForm from 'common/organization/form';
import organizationHours from 'common/organization/hours';

const headers = [
  {
    text: 'Name',
    value: 'name',
    sortable: true
  },
  {
    text: 'Category',
    value: 'category',
    sortable: true
  },
  {
    text: 'Street',
    value: 'street',
    sortable: false
  }
];

var organization = {
  name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  email: '',
  phone: '',
  website: '',
  hours: [{weekday: 1}, {weekday: 2}, {weekday: 3}, {weekday: 4}, {weekday: 5}]
};

export default {
  props: ['community'],
  data: () => ({organizations: [], headers, search: '', organization, error: undefined, msg: '', dialog: false}),
  watch: {
    community: function(community) {
      return getOrganizations.call(this, this.community.id)
    }
  },
  mounted: function() {
    return getOrganizations.call(this, this.community.id);
  },
  components: {
    organizationForm,
    organizationHours
  },
  methods: {create}
};

function create() {
  return this.$http.post(`/communities/${this.community.id}/organizations`, this.organization)
    .then(response => response.json())
    .then(organization => this.organization = organization)
    .then(() => this.dialog = false)
    .then(() => getOrganizations.call(this, this.community.id))
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function getOrganizations(communityID) {
  return this.$http.get(`/communities/${communityID}/organizations`)
    .then(response => response.json())
    .then(organizations => this.organizations = organizations);
}
</script>

<style lang="stylus" scoped>
.btn.btn--floating {
  position: absolute;
  top: 35px;
  right: 15px;
}
.dialog .card__text {
  max-height: 80vh;
}
</style>
