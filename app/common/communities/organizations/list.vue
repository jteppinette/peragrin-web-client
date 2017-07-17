<template>
<div>

  <v-toolbar flat>
    <v-text-field solo prepend-icon="search" :label="!search ? 'Search' : ''" v-model="search" class="ma-2 elevation-0"></v-text-field>
    <v-spacer></v-spacer>
    <v-btn v-if="isAdministrator()" @click.native.stop="dialogs.organizationsCreateUpdate = !dialogs.organizationsCreateUpdate" fab absolute top right><v-icon>add</v-icon></v-btn>
    <organizations-create-update v-model="dialogs.organizationsCreateUpdate" :communityID="community.id" @created="o => getOrganizations(community.id)"></organizations-create-update>
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
  },
  {
    text: 'Administrator',
    value: 'isAdministrator',
    sortable: true
  }
];

let dialogs = {
  organizationsCreateUpdate: false
};

export default {
  props: ['community', 'selected', 'value'],
  data: () => ({organizations: [], headers, search: '', dialogs}),
  watch: {
    community: function(community) {
      return getOrganizations.call(this, this.community.id)
    },
    selected (organization) {
      if (organization) this.search = organization.name;
    }
  },
  mounted: function() {
    return getOrganizations.call(this, this.community.id);
  },
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  components: {organizationsCreateUpdate},
  methods: {getOrganizations, isAdministrator}
};

function getOrganizations(communityID) {
  return this.$http.get(`/communities/${communityID}/organizations`)
    .then(response => response.json())
    .then(organizations => this.organizations = organizations);
}

function isAdministrator() {
  if (!this.account || !this.account.organizations) return false;
  return this.account.organizations.find(v => v.communities ? v.communities.find(c => c.id == this.community.id && c.isAdministrator) : undefined);
}
</script>
