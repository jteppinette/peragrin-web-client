<template>
<div>

  <v-toolbar flat>
    <v-text-field solo prepend-icon="search" :label="!search ? 'Search' : ''" v-model="search" class="ma-2 elevation-0"></v-text-field>
    <v-spacer></v-spacer>
    <v-btn v-if="isAdministrator" @click.native.stop="dialogs.organizationsCreateUpdate = !dialogs.organizationsCreateUpdate" fab absolute top right><v-icon>add</v-icon></v-btn>
    <organizations-create-update v-model="dialogs.organizationsCreateUpdate" :communityID="community.id" @created="o => initializeOrganizations()"></organizations-create-update>
  </v-toolbar>

  <v-data-table :headers="headers" :items="organizations" :search="search" class="no-limit-select">
    <template slot="items" scope="props">
      <td class="text-xs-right"><router-link :to="`/organizations/${props.item.id}`">{{ props.item.name }}</router-link></td>
      <td class="text-xs-right">{{ props.item.category }}</td>
      <td class="text-xs-right">
        <span>{{ props.item.street }}</span><br />
        <small>{{ props.item.city}} , {{ props.item.state }} {{ props.item.zip }}</small>
      </td>
      <td class="text-xs-right"><v-icon v-if="props.item.isAdministrator">check</v-icon></td>
    </template>
  </v-data-table>

</div>
</template>

<script>
import organizationsCreateUpdate from 'common/organizations/create-update';

const headers = [
  {text: 'Name', value: 'name', sortable: true},
  {text: 'Category', value: 'category', sortable: true},
  {text: 'Street', value: 'street', sortable: false},
  {text: 'Administrator', value: 'isAdministrator', sortable: true}
];

let dialogs = {
  organizationsCreateUpdate: false
};

export default {
  props: ['community', 'search'],
  data: () => ({organizations: [], headers, dialogs, isAdministrator: false}),
  mounted: initialize,
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  components: {organizationsCreateUpdate},
  methods: {initializeOrganizations, initializeIsAdministrator}
};

function initialize() {
  return Promise.all([
    this.$store.dispatch('initialize').then(this.initializeIsAdministrator),
    this.initializeOrganizations()
  ]);
}

function initializeOrganizations() {
  return this.$http.get(`/communities/${this.community.id}/organizations`)
    .then(({data: organizations}) => this.organizations = organizations);
}

function initializeIsAdministrator() {
  return this.isAdministrator = this.account.isSuper || (!this.account.organizations ? false : this.account.organizations.find(v => v.communities ? v.communities.find(c => c.id == this.community.id && c.isAdministrator) : undefined));
}
</script>
