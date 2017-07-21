<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item to="/communities">Communities</v-breadcrumbs-item>
    <v-breadcrumbs-item v-if="community" :to="`/communities/${community.id}`">{{ community.name }}</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled v-if="membership">{{ membership.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap v-if="membership">
    <v-flex xs12>
      <v-card>

        <v-card-title primary-title class="primary headline">{{ membership.name }}</v-card-title>

        <!-- SPEED DIAL -->
        <v-card-text class="secondary" style="position: relative">
          <v-speed-dial v-if="isAdministrator" absolute bottom right direction="bottom">
            <v-btn slot="activator" fab><v-icon>apps</v-icon></v-btn>
            <v-btn fab small primary @click.native.stop="dialogs.membershipsCreateUpdate = !dialogs.membershipsCreateUpdate"><v-icon class="white--text">edit</v-icon></v-btn>
            <v-btn fab small primary @click.native.stop="dialogs.membershipsAccountsAdd = !dialogs.membershipsAccountsAdd"><v-icon class="white--text">add</v-icon></v-btn>
            <v-btn fab small primary @click.native.stop="dialogs.membershipsDelete = !dialogs.membershipsDelete"><v-icon class="white--text">delete</v-icon></v-btn>
          </v-speed-dial>
          <memberships-create-update v-model="dialogs.membershipsCreateUpdate" :membership="membership" @updated="m => membership = m"></memberships-create-update>
          <memberships-accounts-add v-model="dialogs.membershipsAccountsAdd" :membership="membership" @success="initializeAccounts"></memberships-accounts-add>
          <confirm-dialog v-model="dialogs.membershipsDelete" @confirmed="deleteMembership">Are you sure you want to delete the membership: {{ membership.name }} ?</confirm-dialog>
          <span>{{ membership.description }}</span>
        </v-card-text>

        <!-- SEARCH -->
        <v-toolbar flat v-if="isAdministrator">
          <v-text-field solo prepend-icon="search" :label="!search ? 'Search' : ''" v-model="search" class="ma-2 elevation-0"></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>

        <!-- ACCOUNTS -->
        <v-data-table v-if="isAdministrator" :headers="headers" :items="accounts" :search="search" class="no-limit-select">
          <template slot="items" scope="props">
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.firstName }}</td>
            <td class="text-xs-right">{{ props.item.lastName }}</td>
            <td v-if="isAdministrator" class="text-xs-right" style="white-space: nowrap">
              <v-btn @click.native="dialogs.accountsDelete[props.item.id] = !dialogs.accountsDelete[props.item.id]" secondary class="ma-0"><v-icon left class="white--text">remove</v-icon>Remove</v-btn>
              <v-btn @click.native.stop="resendResetPasswordEmail(props.item.id)" secondary class="ma-0"><v-icon left class="white--text">send</v-icon>Resend Reset Password Email</v-btn>

              <confirm-dialog v-model="dialogs.accountsDelete[props.item.id]" @confirmed="removeAccount(props.item.id)">Are you sure you want to remove this account, {{ props.item.email }}, from the {{ membership.name }} membership?</confirm-dialog>
            </td>

            <v-snackbar v-model="snackbars.resendResetPasswordEmail[props.item.id]">A reset password email has been sent to {{ props.item.email}}.
              <v-btn flat class="primary--text" @click.native="snackbars.resendResetPasswordEmail[props.item.id] = false">Close</v-btn>
            </v-snackbar>
          </template>
        </v-data-table>

        <v-alert error :value="initialized && !isAdministrator">You do not have permission to view this data.</v-alert>

      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import membershipsAccountsAdd from 'common/memberships/accounts/add';
import membershipsCreateUpdate from 'common/memberships/create-update';
import confirmDialog from 'common/confirm-dialog';

let dialogs = {
  membershipsCreateUpdate: false,
  membershipsAccountsAdd: false,
  membershipsDelete: false,
  accountsDelete: {}
};

let snackbars = {
  resendResetPasswordEmail: {}
};

const headers = [
  {text: 'Email', value: 'email', sortable: true},
  {text: 'First Name', value: 'firstName', sortable: true},
  {text: 'Last Name', value: 'lastName', sortable: true}
];

export default {
  props: ['communityID', 'membershipID'],
  data: () => ({membership: undefined, community: undefined, accounts: undefined, headers, search: '', dialogs, snackbars, isAdministrator: false, initialized: false}),
  mounted: initialize,
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  components: {membershipsCreateUpdate, membershipsAccountsAdd, confirmDialog},
  methods: {initializeCommunity, initializeMembership, initializeAccounts, initializeIsAdministrator, deleteMembership, removeAccount, resendResetPasswordEmail},
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function initialize() {
  return this.$store.dispatch('initialize').then(this.initializeIsAdministrator)
    .then(isAdministrator => {
      if (!isAdministrator) return Promise.all([this.initializeCommunity(), this.initializeMembership()]);
      return Promise.all([this.initializeCommunity(), this.initializeMembership(), this.initializeAccounts()]);
    })
    .catch()
    .then(() => this.initialized = true);
}

function initializeIsAdministrator() {
  this.isAdministrator = !!(this.account.organizations && this.account.organizations.find(v => v.communities ? v.communities.find(c => c.isAdministrator && c.id == this.communityID) : undefined)); 
  return this.isAdministrator;
}

function initializeCommunity() {
  return this.$http.get(`/communities/${this.communityID}`)
    .then(({data: community}) => this.community = community);
}

function initializeMembership() {
  return this.$http.get(`/memberships/${this.membershipID}`)
    .then(({data: membership}) => this.membership = membership);
}

function initializeAccounts() {
  return this.$http.get(`/memberships/${this.membershipID}/accounts`)
    .then(({data: accounts}) => this.accounts = accounts)
    .then(() => this.snackbars.resendResetPasswordEmail = this.accounts.reduce((obj, a) => ({...obj, [a.id]: false}), {}))
    .then(() => this.dialogs.accountsDelete = this.accounts.reduce((obj, a) => ({...obj, [a.id]: false}), {}));
}

function deleteMembership() {
  return this.$http.delete(`/memberships/${this.membershipID}`)
    .then(() => this.$router.push(`/communities/${this.communityID}`));
}

function removeAccount(id) {
  return this.$http.delete(`/memberships/${this.membershipID}/accounts/${id}`)
    .then(this.initializeAccounts);
}

function resendResetPasswordEmail(id) {
  return this.$http.post(`/accounts/${id}/forgot-password`)
    .then(() => this.snackbars.resendResetPasswordEmail[id] = true);
}
</script>
