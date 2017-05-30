<template>
<v-data-table :items="promotions" :headers="headers" hide-actions>
  <template slot="items" scope="props">
    <td class="text-xs-right">{{ props.item.name }}</td>
    <td class="text-xs-right">{{ props.item.description }}</td>
    <td class="text-xs-right">{{ props.item.exclusions }}</td>
    <td class="text-xs-right">{{ props.item.expiration | moment("from", true) }}</td>
    <td class="text-xs-right"><v-icon v-if="props.item.isSingleUse" dark>check</v-icon></td>
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
    text: 'Description',
    value: 'description',
    sortable: false
  },
  {
    text: 'Exclusions',
    value: 'exclusions',
    sortable: false
  },
  {
    text: 'Expiration',
    value: 'expiration',
    sortable: false
  },
  {
    text: 'Is Single Use',
    value: 'isSingleUse',
    sortable: false
  }
];

export default {
  props: {
    promotions: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({headers})
};
</script>
