<template>
<div>

  <v-dialog v-model="dialog" width="400px">
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

  <v-data-table :items="promotions" :headers="headers" hide-actions>
    <template slot="items" scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.description }}</td>
      <td class="text-xs-right">{{ props.item.exclusions }}</td>
      <td class="text-xs-right">{{ props.item.expiration | moment("from", true) }}</td>
      <td class="text-xs-right"><span v-if="membershipsByID && props.item.membershipID">{{ membershipsByID[props.item.membershipID].name }}</span></td>
      <td class="text-xs-right"><v-icon v-if="props.item.isSingleUse" dark>check</v-icon></td>
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
    {text: 'Is Single Use', value: 'isSingleUse', sortable: false}
  ],
  promotion = {
    name: '',
    description: '',
    exclusions: '',
    isSingleUse: false,
    membershipID: null
  };

export default {
  props: ['organizationID', 'communityID'],
  data: () => ({promotions: [], memberships: [], membershipsByID: undefined, promotion, headers, dialog: false, error: false, msg: ''}),
  methods: {create},
  mounted: initialize
};

function initialize() {
  this.$http.get(`/organizations/${this.organizationID}/promotions`)
    .then(response => response.json())
    .then(promotions => this.promotions = promotions);
  this.$http.get(`/communities/${this.communityID}/memberships`)
    .then(response => response.json())
    .then(memberships => this.memberships = memberships)
    .then(memberships => {
      this.membershipsByID = memberships.reduce((result, v) => {
        result[v.id] = v;
        return result;
      }, {});
    });
}

function create() {
  return this.$http.post(`/organizations/${this.organizationID}/promotions`, this.promotion)
    .then(() => this.dialog = false)
    .then(initialize)
    .catch(({data}) => this.error = !!(this.msg = data && data.msg ? data.msg : 'unknown error'));
}
</script>

<style lang="stylus" scoped>
.btn.btn--floating {
  position: absolute;
  top: 35px;
  right: 15px;
}
</style>
