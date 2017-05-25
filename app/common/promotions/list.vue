<template>
<v-data-table :items="promotions" :headers="headers" hide-actions>
  <template slot="items" scope="props">
    <td class="text-xs-right">{{ props.item.name }}</td>
    <td class="text-xs-right">{{ props.item.description }}</td>
    <td class="text-xs-right">{{ props.item.exclusions }}</td>
    <td class="text-xs-right">{{ props.item.expiration }}</td>
    <td class="text-xs-right">{{ props.item.isSingleUse }}</td>
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
  props: ['organizationID'],
  data: () => ({promotions: [], headers}),
  watch: {
    organizationID: function(id) {
      return getOrganizations.call(this, this.organizationID)
    }
  },
  mounted: function() {
    return getPromotions.call(this, this.organizationID);
  }
};

function getPromotions(organizationID) {
  return this.$http.get(`/organizations/${organizationID}/promotions`)
    .then(response => response.json())
    .then(promotions => this.promotions = promotions);
}
</script>
