<template>
<div>
  <div class="pl-3 pr-3">
    <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
  </div>
  <v-data-table :headers="headers" :items="organizations" :search="search">
    <template slot="items" scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.street }}</td>
    </template>
  </v-data-table>
</div>
</template>

<script>
const headers = [
  {
    text: 'Name',
    value: 'name',
    sortable: true
  },
  {
    text: 'Street',
    value: 'street',
    sortable: false
  }
];

export default {
  props: ['id'],
  data: () => ({organizations: [], headers, search: ''}),
  watch: {
    id: function(id) {
      return getOrganizations.call(this, id)
    }
  },
  mounted: function() {
    return getOrganizations.call(this, this.id);
  }
};

function getOrganizations(communityID) {
  return this.$http.get(`/communities/${communityID}/organizations`)
    .then(response => response.json())
    .then(organizations => this.organizations = organizations);
}
</script>
