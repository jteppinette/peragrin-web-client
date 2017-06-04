<template>
<div>

  <v-dialog v-model="dialog" width="400px">
    <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
    <v-card>
      <v-card-row><v-card-title class="primary">Add Membership</v-card-title></v-card-row>
      <v-card-row>
        <v-card-text>
          <form class="pt-3" @keyup.enter="create">
            <v-text-field v-model="membership.name" label="Name"></v-text-field>
            <v-text-field v-model="membership.description" label="Description" rows="1" multi-line></v-text-field>
          </form>
        </v-card-text>
      </v-card-row>
      <v-card-row actions>
        <v-btn flat @click.native="dialog = false">Close</v-btn>
        <v-btn primary class="white--text" @click.native="create">Save</v-btn>
      </v-card-row>
    </v-card>
  </v-dialog>

  <v-expansion-panel class="elevation-0">
    <v-expansion-panel-content v-for="membership in memberships" :key="membership.id">
      <div slot="header"><strong>{{ membership.name }}</strong><br/><small>{{ membership.description }}</small></div>
      <v-data-table :items="accounts[membership.id]" :headers="headers" hide-actions>
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

const headers = [
  {text: 'Email', value: 'email'},
];

export default {
  props: ['communityID'],
  data: () => ({headers, memberships: [], accounts: {}, membership, dialog: false}),
  methods: {create},
  mounted: initialize
};

function initialize() {
  return this.$http.get(`/communities/${this.communityID}/memberships`)
    .then(response => response.json())
    .then(memberships => this.memberships = memberships)
    .then(memberships => {
      for (var i in memberships) {
        let idx = i;
        this.$http.get(`/memberships/${memberships[idx].id}/accounts`)
          .then(response => response.json())
          .then(accounts => {
            return accounts;
          })
          .then(accounts => this.$set(this.accounts, memberships[idx].id, accounts));
      }
    });
}

function create() {
  return this.$http.post(`/communities/${this.communityID}/memberships`, this.membership)
    .then(() => this.dialog = false)
    .then(initialize)
}
</script>

<style lang="stylus" scoped>
.expansion-panel li:first-child {
  border-top: none;
}

.btn.btn--floating {
  position: absolute;
  top: 35px;
  right: 15px;
}
</style>
