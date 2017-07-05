<template>
<div>

  <v-dialog v-if="isOwnerOrAdministrator()" v-model="dialog" width="400px" persistent>
    <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
    <v-card>
      <v-card-row><v-card-title class="primary">Create Promotion</v-card-title></v-card-row>
      <v-alert error dismissible v-model="error">{{ msg }}</v-alert>
      <v-card-row>
        <v-card-text>
          <form @submit.prevent="create" novalidate>
            <v-text-field v-model="promotion.name" :error="error" label="Name"></v-text-field>
            <v-text-field v-model="promotion.description" :error="error" label="Description" rows="1" multi-line></v-text-field>
            <v-text-field v-model="promotion.exclusions" :error="error" label="Exclusions" rows="1" multi-line></v-text-field>

            <v-subheader class="pa-0 pt-2" style="height: 0px">Required Community Membership</v-subheader>
            <v-select :items="memberships" v-model="promotion.membershipID" itemText="name" itemValue="id" label="Membership" dark single-line auto></v-select>

            <v-subheader class="pa-0 pt-2" style="height: 0px">Is Single Use?</v-subheader>
            <v-switch v-model="promotion.isSingleUse" :error="error" :label="promotion.isSingleUse ? 'This promotion can only be used a single time per patron.' : 'This promotion can be used multiple times by the same patron.'" dark></v-switch>

            <div class="right">
              <v-btn flat @click.native="dialog = false">Close</v-btn>
              <v-btn primary type="submit" class="white--text">Create Promotion</v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card-row>
    </v-card>
  </v-dialog>

  <v-data-table :items="promotions" :headers="headers" class="no-limit-select">
    <template slot="items" scope="props">
      <td class="text-xs-right">
        <v-edit-dialog v-if="isOwnerOrAdministrator()" @open="props.item._name = props.item.name" @save="delete props.item._name; update(props.item)" @cancel="props.item.name = props.item._name" large lazy>
          <div class="text-xs-right">{{ props.item.name }}</div>
          <div slot="input" class="mt-3 pb-3 title">Update Name</div>
          <v-text-field slot="input" label="Name" v-model="props.item.name"></v-text-field>
        </v-edit-dialog>
       <div v-else class="text-xs-right">{{ props.item.name }}</div>
      </td>
      <td class="text-xs-right">
        <v-edit-dialog v-if="isOwnerOrAdministrator()" @open="props.item._description = props.item.description" @save="delete props.item._description; update(props.item)" @cancel="props.item.description = props.item._description" large lazy>
          <div class="text-xs-right">{{ props.item.description }}</div>
          <div slot="input" class="mt-3 pb-3 title">Update Description</div>
          <v-text-field slot="input" label="Description" v-model="props.item.description"></v-text-field>
        </v-edit-dialog>
        <div v-else class="text-xs-right">{{ props.item.description }}</div>
      </td>
      <td class="text-xs-right">
        <v-edit-dialog v-if="isOwnerOrAdministrator()" @open="props.item._exclusions = props.item.exclusions" @save="delete props.item._exclusions; update(props.item)" @cancel="props.item.exclusions = props.item._exclusions" large lazy>
          <div class="text-xs-right">{{ props.item.exclusions }}</div>
          <div slot="input" class="mt-3 pb-3 title">Update Exclusions</div>
          <v-text-field slot="input" label="Exclusions" v-model="props.item.exclusions" multi-line></v-text-field>
        </v-edit-dialog>
        <div v-else class="text-xs-right">{{ props.item.exclusions }}</div>
      </td>
      <td class="text-xs-right">{{ props.item.expiration | moment("from", true) }}</td>
      <td class="text-xs-right">
        <span v-if="props.item.membershipID && membershipsByID[props.item.membershipID]">
          <v-edit-dialog v-if="isOwnerOrAdministrator()" @open="props.item._membershipID = props.item.membershipID" @save="delete props.item._membershipID; update(props.item)" @cancel="props.item.membershipID = props.item._membershipID" large lazy>
            <div class="text-xs-right">{{ membershipsByID[props.item.membershipID].community.name }} - {{ membershipsByID[props.item.membershipID].name }}</div>
            <div slot="input" class="mt-3 pb-3 title">Update Community Membership</div>
            <v-select slot="input" :items="memberships" v-model="props.item.membershipID" itemText="name" itemValue="id" label="Community Membership" dark single-line auto></v-select>
          </v-edit-dialog>
          <div v-else class="text-xs-right">{{ membershipsByID[props.item.membershipID].community.name }} - {{ membershipsByID[props.item.membershipID].name }}</div>
        </span>
      </td>
      <td class="text-xs-right">
        <v-edit-dialog v-if="isOwnerOrAdministrator()" @open="props.item._isSingleUse = props.item.isSingleUse" @save="delete props.item._isSingleUse; update(props.item)" @cancel="props.item.isSingleUse = props.item._isSingleUse" large lazy>
          <div class="text-xs-right"><v-icon v-if="props.item.isSingleUse" dark>check</v-icon></div>
          <div slot="input" class="mt-3 pb-3 title">Update Is Single Use</div>
          <v-switch slot="input" v-model="props.item.isSingleUse" :label="props.item.isSingleUse ? 'True' : 'False'" dark></v-switch>
        </v-edit-dialog>
        <div v-else class="text-xs-right"><v-icon v-if="props.item.isSingleUse" dark>check</v-icon></div>
      </td>
      <td class="text-xs-right"><v-btn v-if="isOwnerOrAdministrator()" @click.native="del(props.item)" light primary>Delete<v-icon right light>delete</v-icon></v-btn></td>
    </template>
  </v-data-table>

</div>
</template>

<script>
const headers = [
    {text: 'Name', value: 'name', sortable: true},
    {text: 'Description', value: 'description', sortable: false},
    {text: 'Exclusions', value: 'exclusions', sortable: false},
    {text: 'Expiration', value: 'expiration', sortable: false},
    {text: 'Membership', value: 'membershipID', sortable: false},
    {text: 'Is Single Use', value: 'isSingleUse', sortable: false},
    {sortable: false}
  ],
  promotion = {
    name: '',
    description: '',
    exclusions: '',
    isSingleUse: false,
    membershipID: null
  };

export default {
  props: ['organizationID', 'communities'],
  data: () => ({promotions: [], memberships: [], membershipsByID: {}, promotion, headers, dialog: false, error: false, msg: ''}),
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  methods: {create, update, del, isOwnerOrAdministrator},
  mounted: initialize
};

function initialize() {
  this.$http.get(`/organizations/${this.organizationID}/promotions`)
    .then(response => response.json())
    .then(promotions => this.promotions = promotions);
  for (let i in this.communities) {
    this.$http.get(`/communities/${this.communities[i].id}/memberships`)
      .then(response => response.json())
      .then(memberships => {
        this.memberships.push({header: this.communities[i].name});
        memberships = memberships.map(v => {
          if (!v.id) return v;
          v.community = this.communities[i];
          return v;
        });
        this.memberships = this.memberships.concat(memberships);
        this.membershipsByID = this.memberships.reduce((result, v) => {
          if (!v.id) return result;
          result[v.id] = v;
          return result;
        }, {});
      });
  }
}

function isOwnerOrAdministrator() {
  if (!this.account || !this.account.organizations) return false;
  let isOwner = this.account.organizations.find(v => v.id == this.organizationID);
  let isAdministrator = this.communities ? this.account.organizations.find(v => {
    if (!v.communities) return false;
    let community = v.communities.find(c => {
      return this.communities.find(u => u.id == c.id);
    });
    return community.isAdministrator;
  }) : false;
  return isOwner || isAdministrator;
}

function create() {
  return this.$http.post(`/organizations/${this.organizationID}/promotions`, this.promotion)
    .then(() => this.dialog = false)
    .then(initialize)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}

function update(data) {
  return this.$http.put(`/promotions/${data.id}`, data)
    .then(({data: promotion}) => data = promotion);
}

function del(promotion) {
  return this.$http.delete(`/promotions/${promotion.id}`)
    .then(initialize);
}
</script>

<style lang="stylus" scoped>
.btn.btn--floating {
  position: absolute;
  top: 35px;
  right: 15px;
}
</style>
