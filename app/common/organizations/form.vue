<template>
<div>

  <v-subheader>General</v-subheader>
  <v-text-field v-model="value.name" type="text" label="Name"></v-text-field>
  <v-text-field v-model="value.email" type="text" label="Email"></v-text-field>
  <v-text-field v-model="value.phone" type="text" label="Phone Number"></v-text-field>
  <v-text-field v-model="value.website" type="text" label="Website"></v-text-field>
  <v-select v-if="value.category !== 'Community Leader'" label="Category" item-text="name" item-value="name" :items="categories" v-model="value.category" auto>
    <template slot="item" scope="data">
      <v-list-tile-avatar><v-icon>{{ data.item.icon }}</v-icon></v-list-tile-avatar>
      <v-list-tile-content><v-list-tile-title>{{ data.item.name }}</v-list-tile-title></v-list-tile-content>
    </template>
  </v-select>

  <v-subheader>Address</v-subheader>
  <p class="pb-3">Update the address information below to set this organization's icon location on the map. The icon location has been set when you see a map below.</p>

  <v-text-field v-model="value.street" type="text" label="Street"></v-text-field>

  <v-layout row wrap>
    <v-flex xs6><v-text-field v-model="value.city" type="text" label="City"></v-text-field></v-flex>
    <v-flex xs6><v-select :items="states" v-model="value.state" auto label="State"></v-select></v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs6><v-text-field v-model="value.zip" type="text" label="Zip"></v-text-field></v-flex>
    <v-flex xs6><v-select :items="countries" v-model="value.country" auto label="Country"></v-select></v-flex>
  </v-layout>

  <p v-if="!value.lon || !value.lat" class="secondary--text subheading">A correct address is required to create an organization. Please update the address above.</p>

</div>
</template>

<script>
import {CATEGORIES, MARKERS} from 'common/categories';
import _ from 'lodash';

const STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
];

const COUNTRIES = [
  'US'
];

export default {
  data: () => ({categories: CATEGORIES, states: STATES, countries: COUNTRIES}),
  props: ['value'],
  computed: {
    address () {
      return {street: this.value.street, city: this.value.city, zip: this.value.zip, state: this.value.state, country: this.value.country};
    }
  },
  watch: {
    address (n, o) {
      if ((n.street && !o.street) && (n.city && !o.city) && (n.zip && !o.zip) && (n.state && !o.state) && (n.country && !o.country)) return;
      return this.geocode();
    }
  },
  methods: {geocode: _.debounce(geocode, 1000)}
}

function geocode() {
  if (!this.value.street || !this.value.city || !this.value.zip || !this.value.state || !this.value.country) {
    this.$set(this.value, 'lon', undefined);
    this.$set(this.value, 'lat', undefined);
    return
  }
  return this.$http.post('/geo', this.address)
    .then(({data: {lon, lat}}) => {
      this.$set(this.value, 'lon', lon);
      this.$set(this.value, 'lat', lat);
    })
    .catch(() => {
      this.$set(this.value, 'lon', undefined);
      this.$set(this.value, 'lat', undefined);
    });
}
</script>

<style scoped lang="stylus">
.subheader {
  padding: 0px;
}

.input-group {
  margin: 0px !important;
  margin-top: 10px !important;
}
</style>
