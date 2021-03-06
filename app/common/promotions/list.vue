<template>
<div style="position: relative">

  <v-btn v-if="communities.length && isAdministrator && initialized" @click.stop="dialogs.promotionsCreate = !dialogs.promotionsCreate" fab absolute top right><v-icon>add</v-icon></v-btn>
  <promotions-create-update v-model="dialogs.promotionsCreate" :communities="communities" :organizationID="organizationID" @created="initializePromotions"></promotions-create-update>

  <v-card-text v-if="!communities.length && initialized" class="secondary expose">
    <p>Managing promotions requires that this organization be a member of a community. View the community panel below for more information.</p>
  </v-card-text>

  <v-data-table v-if="communities.length && initialized" :items="promotions" :headers="headers" class="no-limit-select">
    <template slot="items" scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.redemptions || '0' }}</td>
      <td class="text-xs-right">{{ props.item.description }}</td>
      <td class="text-xs-right">{{ props.item.exclusions }}</td>
      <td class="text-xs-right">{{ props.item.expiration | moment("from", true) }}</td>
      <td class="text-xs-right"><v-chip v-for="id in props.item.communities" :key="id" v-if="communitiesByID[id]">{{ communitiesByID[id].name }}</v-chip></td>
      <td class="text-xs-right"><v-icon v-if="props.item.isSingleUse">check</v-icon></td>
      <td class="text-xs-right" style="white-space: nowrap">
        <v-btn v-if="isAdministrator" @click.stop="dialogs.promotionsDelete[props.item.id] = !dialogs.promotionsDelete[props.item.id]" secondary class="ma-0"><v-icon left class="white--text">delete</v-icon>Delete</v-btn>
        <v-btn v-if="isAdministrator" @click.stop="dialogs.promotionsUpdate[props.item.id] = !dialogs.promotionsUpdate[props.item.id]" secondary class="ma-0"><v-icon left class="white--text">edit</v-icon>Update</v-btn>

        <promotions-create-update v-model="dialogs.promotionsUpdate[props.item.id]" :communities="communities" :promotion="props.item" :organizationID="organizationID" @updated="initializePromotions" :key="props.item.id"></promotions-create-update>
        <confirm-dialog v-model="dialogs.promotionsDelete[props.item.id]" @confirmed="del(props.item)">Are you sure you want to delete the promotion: {{ props.item.name }} ?</confirm-dialog>
      </td>
    </template>
  </v-data-table>

</div>
</template>

<script>
import promotionsCreateUpdate from 'common/promotions/create-update';
import confirmDialog from 'common/confirm-dialog';

const headers = [
  {text: 'Name', value: 'name', sortable: true},
  {text: 'Redemptions', value: 'redemptions', sortable: true},
  {text: 'Description', value: 'description', sortable: false},
  {text: 'Exclusions', value: 'exclusions', sortable: false},
  {text: 'Expiration', value: 'expiration', sortable: false},
  {text: 'Community Membership Requirements', value: 'communities', sortable: false},
  {text: 'Is Single Use', value: 'isSingleUse', sortable: false},
  {sortable: false}
];

let dialogs = {
  promotionsCreate: false,
  promotionsUpdate: {},
  promotionsDelete: {}
};

export default {
  props: ['organizationID', 'communities'],
  data: () => ({promotions: [], headers, dialogs, error: false, msg: '', initialized: false}),
  components: {promotionsCreateUpdate, confirmDialog},
  computed: {
    isAdministrator () {
      let isSuper = this.$store.state.account.isSuper;
      let isOwner = this.$store.state.organizations.indexOf(Number(this.organizationID)) >= 0;
      let isAdministrator = this.communities.some(c => this.$store.state.communities.indexOf(c.id) >= 0);
      return isSuper || isOwner || isAdministrator;
    },
    communitiesByID () {
      return this.communities.reduce((obj, c) => {
        return {...obj, [c.id]: c};
      }, {});
    }
  },
  methods: {del, initializePromotions},
  mounted: initialize
};

function initialize() {
  return this.initializePromotions()
    .then(() => this.initialized = true);
}

function initializePromotions() {
  return this.$http.get(`/organizations/${this.organizationID}/promotions`)
    .then(({data: promotions}) => this.promotions = promotions)
    .then(() => this.dialogs.promotionsUpdate = this.promotions.reduce((obj, p) => ({...obj, [p.id]: false}), {}))
    .then(() => this.dialogs.promotionsDelete = this.promotions.reduce((obj, p) => ({...obj, [p.id]: false}), {}))
}

function del(promotion) {
  return this.$http.delete(`/promotions/${promotion.id}`)
    .then(initializePromotions);
}
</script>
