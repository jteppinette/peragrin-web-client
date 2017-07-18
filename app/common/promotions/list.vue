<template>
<div>

  <v-card-text style="position: relative">
    <v-btn v-if="isAdministrator" @click.native.stop="dialogs.promotionsCreate = !dialogs.promotionsCreate" fab absolute top right><v-icon>add</v-icon></v-btn>
    <promotions-create-update v-model="dialogs.promotionsCreate" :organizationID="organizationID" @created="initializePromotions"></promotions-create-update>
  </v-card-text>

  <v-data-table :items="promotions" :headers="headers" class="no-limit-select">
    <template slot="items" scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.description }}</td>
      <td class="text-xs-right">{{ props.item.exclusions }}</td>
      <td class="text-xs-right">{{ props.item.expiration | moment("from", true) }}</td>
      <td class="text-xs-right">
        <span v-if="initialized">{{ membershipsByID[props.item.membershipID].community.name }} ({{ membershipsByID[props.item.membershipID].name }})</span>
      </td>
      <td class="text-xs-right"><v-icon v-if="props.item.isSingleUse">check</v-icon></td>
      <td class="text-xs-right" style="white-space: nowrap">
        <v-btn v-if="isAdministrator" @click.native="del(props.item)" primary class="ma-0"><v-icon left class="white--text">delete</v-icon>Delete</v-btn>
        <v-btn v-if="isAdministrator" @click.native.stop="dialogs.promotionsUpdate[props.item.id] = !dialogs.promotionsUpdate[props.item.id]" primary class="ma-0"><v-icon left class="white--text">edit</v-icon>Update</v-btn>
        <promotions-create-update v-model="dialogs.promotionsUpdate[props.item.id]" :promotion="props.item" :organizationID="organizationID" @updated="initializePromotions"></promotions-create-update>
      </td>
    </template>
  </v-data-table>

</div>
</template>

<script>
import promotionsCreateUpdate from 'common/promotions/create-update';

const headers = [
  {text: 'Name', value: 'name', sortable: true},
  {text: 'Description', value: 'description', sortable: false},
  {text: 'Exclusions', value: 'exclusions', sortable: false},
  {text: 'Expiration', value: 'expiration', sortable: false},
  {text: 'Membership', value: 'membershipID', sortable: false},
  {text: 'Is Single Use', value: 'isSingleUse', sortable: false},
  {sortable: false}
];

let dialogs = {
  promotionsCreate: false,
  promotionsUpdate: {}
};

export default {
  props: ['organizationID'],
  data: () => ({communities: [], memberships: [], promotions: [], headers, dialogs, error: false, msg: '', initialized: false, isAdministrator: false}),
  components: {promotionsCreateUpdate},
  computed: {
    account () {
      return this.$store.state.account;
    },
    membershipsByID () {
      return this.memberships.reduce((obj, membership) => ({...obj, [membership.id]: membership}), {});
    }
  },
  methods: {del, initializeIsAdministrator, initializePromotions, initializeCommunities, initializeMemberships},
  mounted: initialize
};

function initialize() {
  return Promise.all([
    this.initializePromotions(),
    Promise.all([
      this.$store.dispatch('initialize'),
      this.initializeCommunities().then(this.initializeMemberships)
    ]).then(this.initializeIsAdministrator)
  ]).then(() => this.initialized = true);
}

function initializePromotions() {
  return this.$http.get(`/organizations/${this.organizationID}/promotions`)
    .then(({data: promotions}) => this.promotions = promotions)
    .then(promotions => promotions.map(p => this.$set(this.dialogs.promotionsUpdate, p.id, false)));
}

function initializeCommunities() {
  return this.$http.get(`/organizations/${this.organizationID}/communities`)
    .then(({data: communities}) => this.communities = communities);
}

function initializeMemberships() {
  return Promise.all(this.communities.map(community => {
    return this.$http.get(`/communities/${community.id}/memberships`)
      .then(({data: memberships}) => memberships.map(m => ({...m, community})))
      .then(memberships => this.memberships.push(...memberships));
  }));
}

function initializeIsAdministrator() {
  if (!this.account.organizations) return this.isAdministrator = false;
  let isOwner = this.account.organizations.find(v => v.id == this.organizationID);
  let isAdministrator = this.communities ? this.account.organizations.find(v => {
    if (!v.communities) return false;
    let community = v.communities.find(c => this.communities.find(u => u.id == c.id));
    return community ? community.isAdministrator : false;
  }) : false;
  return this.isAdministrator = isOwner || isAdministrator;
}

function del(promotion) {
  return this.$http.delete(`/promotions/${promotion.id}`)
    .then(initializePromotions);
}
</script>
