<template>
<div>

  <v-dialog v-model="dialog" width="400px">
    <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
    <v-card>
      <v-card-row><v-card-title class="primary">Add Promotion</v-card-title></v-card-row>
      <v-card-row>
        <v-card-text>
          <form class="pt-3" @keyup.enter="create">

            <v-text-field v-model="promotion.name" label="Name"></v-text-field>
            <v-text-field v-model="promotion.description" label="Description" rows="1" multi-line></v-text-field>
            <v-text-field v-model="promotion.exclusions" label="Exclusions" rows="1" multi-line></v-text-field>

            <v-subheader class="pa-0 pt-2" style="height: 0px">Is Single Use?</v-subheader>
            <v-switch v-model="promotion.isSingleUse" :label="promotion.isSingleUse ? 'This promotion can only be used a single time per patron.' : 'This promotion can be used multiple times by the same patron.'" dark></v-switch>

          </form>
        </v-card-text>
      </v-card-row>
      <v-card-row actions>
        <v-btn flat @click.native="dialog = false">Close</v-btn>
        <v-btn primary class="white--text" @click.native="create">Save</v-btn>
      </v-card-row>
    </v-card>
  </v-dialog>

  <v-data-table :items="promotions" :headers="headers" hide-actions>
    <template slot="items" scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.description }}</td>
      <td class="text-xs-right">{{ props.item.exclusions }}</td>
      <td class="text-xs-right">{{ props.item.expiration | moment("from", true) }}</td>
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
  {text: 'Is Single Use', value: 'isSingleUse', sortable: false}
];

var promotion = {
  name: '',
  description: '',
  exclusions: '',
  isSingleUse: false
};

export default {
  props: ['organizationID'],
  data: () => ({promotions: [], promotion, headers, dialog: false}),
  methods: {create},
  mounted: initialize
};

function initialize() {
  return this.$http.get(`/organizations/${this.organizationID}/promotions`)
    .then(response => response.json())
    .then(promotions => this.promotions = promotions);
}

function create() {
  return this.$http.post(`/organizations/${this.organizationID}/promotions`, this.promotion)
    .then(() => this.dialog = false)
    .then(initialize)
}
</script>

<style lang="stylus" scoped>
.btn.btn--floating {
  position: absolute;
  top: 35px;
  right: 15px;
}
</style>
