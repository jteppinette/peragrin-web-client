<template>
  <v-data-table v-model="organizations" :headers="headers" hide-actions>
    <template slot="items" scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.address }}</td>
    </template>
  </v-data-table>
</template>

<script>
const headers = [
  {
    text: 'Name',
    value: 'name',
    sortable: true
  },
  {
    text: 'Address',
    value: 'address',
    sortable: true
  }
];

export default {
  props: ['communityID'],
  data: () => ({organizations: [], headers}),
  mounted
};

function mounted () {
  this.$http.get(`/communities/${this.communityID}/organizations`)
    .then(response => response.json())
    .then((organizations) => this.organizations = organizations);
}
</script>
