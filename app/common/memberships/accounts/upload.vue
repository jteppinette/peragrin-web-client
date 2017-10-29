<template>
<v-dialog v-model="value" width="600px" scrollable persistent>
  <v-card v-if="value">
    <v-card-title class="primary title">Upload Accounts</v-card-title>
    <form @submit.prevent="upload" novalidate>

      <v-card-text v-if="!accounts" class="secondary expose">
        <v-layout row wrap>
          <v-flex xs12 md6>
            <p>You can bulk add accounts through the <strong>CSV file upload</strong> input below. Download this <a href="/assets/templates/accounts.csv">example csv</a> to see a properly formatted csv file. Remember, there should be no spaces before or after the delimiter.</p>
          </v-flex>
          <v-flex xs12 md6>
            <p>After you have uploaded the CSV file, confirm that the file was parsed correctly by inspecting the <i>Parsed Accounts</i> table. If the acounts are correct, then <strong>press <i>Upload</i> in the bottom right</strong>. This will trigger their accounts to be created and activation emails sent out.</p>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-text>
        <v-btn :primary="!accounts" class="file">{{ accounts ? 'Select New CSV File' : 'Select CSV File' }}<input @change="selectCSVFile" type="file"></v-btn>
      </v-card-text>

      <v-card-title v-if="accounts" class="primary title">Parsed Accounts</v-card-title>
      <v-data-table v-if="accounts" :headers="headers" :items="accounts">
        <template slot="items" scope="props">
          <td class="text-xs-right">{{ props.item.email }}</td>
          <td class="text-xs-right">{{ props.item.firstName }}</td>
          <td class="text-xs-right">{{ props.item.lastName }}</td>
          <td class="text-xs-right">{{ props.item.expiration | moment('from') }}</td>
        </template>
      </v-data-table>

      <v-card-actions class="secondary">
        <v-spacer></v-spacer>
        <v-btn flat class="white--text" @click="$emit('input', false)">Close</v-btn>
        <v-btn outline class="white--text" :error="error" :loading="submitting" type="submit">Upload</v-btn>
      </v-card-actions>

      <v-snackbar v-if="value" v-model="error" error>{{ msg }}
        <v-btn flat @click="error = false" class="white--text">Close</v-btn>
      </v-snackbar>

    </form>
  </v-card>
</v-dialog>
</template>
<script>
import _ from 'lodash';
import Papa from 'papaparse';

const headers = [
  {text: 'Email', value: 'email', sortable: true},
  {text: 'First Name', value: 'firstName', sortable: true},
  {text: 'Last Name', value: 'lastName', sortable: true},
  {text: 'Expiration', value: 'expiration', sortable: true}
];

export default {
  props: ['membership', 'value'],
  data: () => ({submitting: false, msg: '', error: false, accounts: undefined, headers}),
  watch: {
    value (v) {
      if (v) this.initialize();
    }
  },
  methods: {initialize, selectCSVFile, upload}
};

function initialize() {
  this.submitting = false;
  this.msg = '';
  this.error = false;
}

function selectCSVFile(e) {
  if (!e.target.files[0]) return;
  Papa.parse(e.target.files[0], {
    complete: results => {
      let headers = ['email', 'firstName', 'lastName', 'expiration'];
      let accounts = results.data.map(record => {
        let account = {};
        for (let i = 0; i < 4 && record.length; i++) {
          account[headers[i]] = record.shift().trim();
        }
        return account;
      });
      this.accounts = accounts.filter(a => a.email);
      e.target.value = "";
    }
  });
}

function upload() {
  this.submitting = true;
  return this.$http.post(`/memberships/${this.membership.id}/accounts`, this.accounts, {headers: {'X-Action': 'bulk'}})
    .then(() => this.accounts = undefined)
    .then(() => this.$emit('uploaded'))
    .then(() => this.$emit('input', false))
    .catch(({data}) => this.error= !!(this.msg = data && data.msg ? data.msg : 'unknown error'))
    .then(() => this.submitting = false);
}
</script>
