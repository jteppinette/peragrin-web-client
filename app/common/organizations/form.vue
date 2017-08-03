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
  <p class="pb-3">Update the address information below to set this organization's icon location on the map.</p>

  <v-text-field v-model="value.street" type="text" label="Street"></v-text-field>

  <v-layout row wrap>
    <v-flex xs6><v-text-field v-model="value.city" type="text" label="City"></v-text-field></v-flex>
    <v-flex xs6><v-select :items="states" item-value="code" item-text="name" v-model="value.state" auto label="State"></v-select></v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs6><v-text-field v-model="value.zip" type="text" label="Zip"></v-text-field></v-flex>
    <v-flex xs6><v-select :items="countries" v-model="value.country" auto label="Country"></v-select></v-flex>
  </v-layout>

</div>
</template>

<script>
import {CATEGORIES, MARKERS} from 'common/categories';
import {STATES, COUNTRIES} from 'common/geo';
import _ from 'lodash';

export default {
  data: () => ({categories: CATEGORIES, states: STATES, countries: COUNTRIES}),
  props: ['value'],
  computed: {
    address () {
      return {street: this.value.street, city: this.value.city, zip: this.value.zip, state: this.value.state, country: this.value.country};
    },
    state () {
      return STATES.find(s => s.code == this.value.state);
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
    this.$set(this.value, 'lon', this.state.lon);
    this.$set(this.value, 'lat', this.state.lat);
    return
  }
  return this.$http.post('/geo', this.address)
    .then(({data: {lon, lat}}) => {
      this.$set(this.value, 'lon', lon);
      this.$set(this.value, 'lat', lat);
      this.$emit('geo-hit');
    })
    .catch(() => {
      this.$set(this.value, 'lon', this.state.lon);
      this.$set(this.value, 'lat', this.state.lat);
      this.$emit('geo-miss');
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
