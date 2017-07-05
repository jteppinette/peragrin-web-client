<template>
<div>

  <v-dialog v-if="isOwnerAndAdministrator()" v-model="createMembershipDialog" width="400px" persistent>
    <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
    <v-card>
      <v-card-row><v-card-title class="primary">Create Membership</v-card-title></v-card-row>
      <v-alert error dismissible v-model="createMembershipError">{{ createMembershipMsg }}</v-alert>
      <v-card-row>
        <v-card-text>
          <form @submit.prevent="createMembership" novalidate>
            <v-text-field v-model="membership.name" :error="createMembershipError" label="Name"></v-text-field>
            <v-text-field v-model="membership.description" :error="createMembershipError" label="Description" rows="1" multi-line></v-text-field>
            <div class="right">
              <v-btn flat @click.native="createMembershipDialog = false">Close</v-btn>
              <v-btn primary type="submit" class="white--text">Create Membership</v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card-row>
    </v-card>
  </v-dialog>

  <v-expansion-panel class="elevation-0">
    <v-expansion-panel-content v-for="membership in memberships" :key="membership.id">
      <div slot="header"><strong>{{ membership.name }}</strong><br/><small>{{ membership.description }}</small></div>
      <div class="pa-2" v-if="isOwnerAndAdministrator()">
        <v-dialog v-model="addAccountDialog[membership.id]" width="400px" persistent>
          <v-btn block primary light slot="activator" class="ma-0">Add Account</v-btn>
          <v-card>
            <v-card-row><v-card-title class="primary">Add {{ membership.name }} Account</v-card-title></v-card-row>
            <v-alert error dismissible v-model="addAccountError">{{ addAccountMsg }}</v-alert>
            <v-card-row>
              <v-card-text>
                <form @submit.prevent="addAccount(membership)" novalidate>
                  <v-text-field v-model="user.email" :error="addAccountError" label="Email"></v-text-field>
                  <v-text-field v-model="user.password" :error="addAccountError" label="Password" type="password"></v-text-field>
                  <div class="right">
                    <v-btn flat @click.native="closeAccountDialog(membership)">Close</v-btn>
                    <v-btn primary type="submit" class="white--text">Add Account</v-btn>
                  </div>
                </form>
              </v-card-text>
            </v-card-row>
          </v-card>
        </v-dialog>
      </div>

      <div v-if="users[membership.id] && users[membership.id].length" class="pl-2 pr-2">
        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </div>
      <v-data-table v-if="users[membership.id] && users[membership.id].length" :items="users[membership.id]" :search="search" class="no-limit-select no-headers">
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

var user = {
  email: '',
  password: ''
};

export default {
  props: ['communityID'],
  data: () => ({
    memberships: [],
    users: {},
    user,
    membership,
    createMembershipDialog: false,
    createMembershipError: false,
    createMembershipMsg: '',
    addAccountDialog: {},
    addAccountError: false,
    addAccountMsg: '',
    search: ''
  }),
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  methods: {createMembership, addAccount, closeAccountDialog, isOwnerAndAdministrator},
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
    .then(users => this.$set(this.users, membership.id, users));
}

function createMembership() {
  return this.$http.post(`/communities/${this.communityID}/memberships`, this.membership)
    .then(() => this.createMembershipDialog = false)
    .then(initialize)
    .catch(({data}) => this.createMembershipError = !!(this.createMembershipMsg = data && data.msg ? data.msg : 'unknown error'));
}

function addAccount(membership) {
  return this.$http.post(`/memberships/${membership.id}/accounts`, this.user)
    .then(() => this.$set(this.addAccountDialog, membership.id, false))
    .then(() => initializeMembershipAccounts.call(this, membership))
    .catch(({data}) => this.addAccountError = !!(this.addAccountMsg = data && data.msg ? data.msg : 'unknown error'));
}

function isOwnerAndAdministrator() {
  if (!this.account || !this.account.organizations) return false;
  return this.account.organizations.find(v => v.communities ? v.communities.find(c => c.isAdministrator && c.id == this.communityID) : undefined);
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

<style lang="stylus">
.no-limit-select .datatable__actions__select {
  display: none !important;
}
.no-headers .datatable thead {
  display: none;
}
</style>
