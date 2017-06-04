<template>
<div>

  <v-dialog v-model="createMembershipDialog" width="400px">
    <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
    <v-card>
      <v-card-row><v-card-title class="primary">Add Membership</v-card-title></v-card-row>
      <v-card-row>
        <v-card-text>
          <form class="pt-3" @keyup.enter="createMembership">
            <v-text-field v-model="membership.name" label="Name"></v-text-field>
            <v-text-field v-model="membership.description" label="Description" rows="1" multi-line></v-text-field>
          </form>
        </v-card-text>
      </v-card-row>
      <v-card-row actions>
        <v-btn flat @click.native="createMembershipDialog = false">Close</v-btn>
        <v-btn primary class="white--text" @click.native="createMembership">Save</v-btn>
      </v-card-row>
    </v-card>
  </v-dialog>

  <v-expansion-panel class="elevation-0">
    <v-expansion-panel-content v-for="membership in memberships" :key="membership.id">
      <div slot="header"><strong>{{ membership.name }}</strong><br/><small>{{ membership.description }}</small></div>

      <v-container fluid>
        <v-dialog v-model="addAccountDialog[membership.id]" width="400px">
          <v-btn block primary light slot="activator">Add Account</v-btn>
          <v-card>
            <v-card-row><v-card-title class="primary">Add {{ membership.name }} Account</v-card-title></v-card-row>
            <v-card-row>
              <v-card-text>
                <form class="pt-3" @keyup.enter="addAccount(membership)">
                  <v-text-field v-model="account.email" label="Email"></v-text-field>
                  <v-text-field v-model="account.password" label="Password" type="password"></v-text-field>
                </form>
              </v-card-text>
            </v-card-row>
            <v-card-row actions>
              <v-btn flat @click.native="closeAccountDialog(membership)">Close</v-btn>
              <v-btn primary class="white--text" @click.native="addAccount(membership)">Save</v-btn>
            </v-card-row>
          </v-card>
        </v-dialog>
      </v-container>

      <v-data-table v-if="accounts[membership.id] && accounts[membership.id].length" :items="accounts[membership.id]" :headers="headers" hide-actions>
        <template slot="items" scope="props"><td class="text-xs-right">{{ props.item.email }}</td></template>
      </v-data-table>

    </v-expansion-panel-content>
  </v-expansion-panel>

</div>
</template>

<script>
var membership = {
  name: '',
  description: ''
};

var account = {
  email: '',
  password: ''
};

const headers = [
  {text: 'Email', value: 'email'},
];

export default {
  props: ['communityID'],
  data: () => ({headers, memberships: [], accounts: {}, account, membership, createMembershipDialog: false, addAccountDialog: {}}),
  methods: {createMembership, addAccount, closeAccountDialog},
  mounted: initialize
};

function closeAccountDialog(membership) {
  this.$set(this.addAccountDialog, membership.id, false);
}

function initialize() {
  return this.$http.get(`/communities/${this.communityID}/memberships`)
    .then(response => response.json())
    .then(memberships => this.memberships = memberships)
    .then(memberships => memberships.map(membership => {
      initializeMembershipAccounts.call(this, membership);
      this.$set(this.addAccountDialog, membership.id, false);
    }));
}

function initializeMembershipAccounts(membership) {
  return this.$http.get(`/memberships/${membership.id}/accounts`)
    .then(response => response.json())
    .then(accounts => this.$set(this.accounts, membership.id, accounts));
}

function createMembership() {
  return this.$http.post(`/communities/${this.communityID}/memberships`, this.membership)
    .then(() => this.createMembershipDialog = false)
    .then(initialize);
}

function addAccount(membership) {
  return this.$http.post(`/memberships/${membership.id}/accounts`, this.account)
    .then(() => this.$set(this.addAccountDialog, membership.id, false))
    .then(() => initializeMembershipAccounts.call(this, membership));
}
</script>

<style lang="stylus" scoped>
.expansion-panel li:first-child {
  border-top: none;
}

.expansion-panel > li {
  border-right: none;
  border-left: none;
}

.btn.btn--floating {
  position: absolute;
  top: 35px;
  right: 15px;
}

.dialog__container {
  width: 100%;
}
</style>
