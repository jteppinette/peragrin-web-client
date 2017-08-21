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
            <v-btn fab small primary @click.stop="dialogs.membershipsUpdate = !dialogs.membershipsUpdate"><v-icon class="white--text">edit</v-icon></v-btn>
            <v-btn fab small primary @click.stop="dialogs.accountsAdd = !dialogs.accountsAdd"><v-icon class="white--text">add</v-icon></v-btn>
            <v-btn fab small primary @click.stop="dialogs.membershipsDelete = !dialogs.membershipsDelete"><v-icon class="white--text">delete</v-icon></v-btn>
          </v-speed-dial>
          <memberships-create-update v-model="dialogs.membershipsUpdate" :membership="membership" @updated="m => membership = m"></memberships-create-update>
          <memberships-accounts-add-update v-model="dialogs.accountsAdd" :membership="membership" @added="initializeAccounts"></memberships-accounts-add-update>
          <confirm-dialog v-model="dialogs.membershipsDelete" @confirmed="deleteMembership">Are you sure you want to delete the membership: {{ membership.name }} ?</confirm-dialog>
          <span>{{ membership.description }}</span>
        </v-card-text>

        <!-- SEARCH -->
        <v-toolbar flat v-if="isAdministrator">
          <v-text-field solo prepend-icon="search" v-model="search" class="ma-2 elevation-0"></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>

        <!-- ACCOUNTS -->
        <v-data-table v-if="isAdministrator" :headers="headers" :items="accounts" :search="search" class="no-limit-select">
          <template slot="items" scope="props">
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.firstName }}</td>
            <td class="text-xs-right">{{ props.item.lastName }}</td>
            <td class="text-xs-right">{{ props.item.expiration | moment("from") }}</td>
            <td v-if="isAdministrator" class="text-xs-right" style="white-space: nowrap">
              <v-btn @click.stop="dialogs.accountsUpdate[props.item.id] = !dialogs.accountsUpdate[props.item.id]" secondary class="ma-0"><v-icon left class="white--text">edit</v-icon>Update</v-btn>
              <v-btn @click.stop="dialogs.accountsDelete[props.item.id] = !dialogs.accountsDelete[props.item.id]" secondary class="ma-0"><v-icon left class="white--text">remove</v-icon>Remove</v-btn>
              <v-btn @click.stop="resendResetPasswordEmail(props.item.id)" secondary class="ma-0"><v-icon left class="white--text">send</v-icon>Resend Reset Password Email</v-btn>

              <memberships-accounts-add-update v-model="dialogs.accountsUpdate[props.item.id]" :membership="membership" :account="props.item" @updated="initializeAccounts" :key="props.item.id"></memberships-accounts-add-update>
              <confirm-dialog v-model="dialogs.accountsDelete[props.item.id]" @confirmed="removeAccount(props.item.id)">Are you sure you want to remove this account, {{ props.item.email }}, from the {{ membership.name }} membership?</confirm-dialog>
            </td>

            <v-snackbar v-model="snackbars.resendResetPasswordEmail[props.item.id]">A reset password email has been sent to {{ props.item.email}}.
              <v-btn flat class="primary--text" @click="snackbars.resendResetPasswordEmail[props.item.id] = false">Close</v-btn>
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
import membershipsAccountsAddUpdate from 'common/memberships/accounts/add-update';
import membershipsCreateUpdate from 'common/memberships/create-update';
import confirmDialog from 'common/confirm-dialog';

let dialogs = {
  membershipsUpdate: false,
  membershipsDelete: false,
  accountsAdd: false,
  accountsUpdate: {},
  accountsDelete: {}
};

let snackbars = {
  resendResetPasswordEmail: {}
};

const headers = [
  {text: 'Email', value: 'email', sortable: true},
  {text: 'First Name', value: 'firstName', sortable: true},
  {text: 'Last Name', value: 'lastName', sortable: true},
  {text: 'Expiration', value: 'expiration', sortable: true}
];

export default {
  props: ['communityID', 'membershipID'],
  data: () => ({membership: undefined, community: undefined, accounts: undefined, headers, search: '', dialogs, snackbars, initialized: false}),
  mounted: initialize,
  computed: {
    isAdministrator () {
      return this.$store.state.account || (this.$store.state.communities.indexOf(this.communityID) >= 0);
    }
  },
  components: {membershipsCreateUpdate, membershipsAccountsAddUpdate, confirmDialog},
  methods: {initializeCommunity, initializeMembership, initializeAccounts, deleteMembership, removeAccount, resendResetPasswordEmail}
};

function initialize() {
  let promise = !this.isAdministrator ?
    Promise.all([this.initializeCommunity(), this.initializeMembership()]) :
    Promise.all([this.initializeCommunity(), this.initializeMembership(), this.initializeAccounts()]);
  return promise.catch().then(() => this.initialized = true);
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
    .then(() => this.dialogs.accountsDelete = this.accounts.reduce((obj, a) => ({...obj, [a.id]: false}), {}))
    .then(() => this.dialogs.accountsUpdate = this.accounts.reduce((obj, a) => ({...obj, [a.id]: false}), {}));
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
