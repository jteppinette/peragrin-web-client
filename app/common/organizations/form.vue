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
  <v-text-field v-model="value.street" type="text" label="Street"></v-text-field>
  <v-layout row wrap>
    <v-flex xs6><v-text-field v-model="value.city" type="text" label="City"></v-text-field></v-flex>
    <v-flex xs6><v-text-field v-model="value.state" type="text" label="State"></v-text-field></v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs6><v-text-field v-model="value.zip" type="text" label="Zip"></v-text-field></v-flex>
    <v-flex xs6><v-text-field v-model="value.country" type="text" label="Country"></v-text-field></v-flex>
  </v-layout>

</div>
</template>

<script>
import {CATEGORIES} from 'common/categories';

export default {
  data: () => ({categories: CATEGORIES}),
  props: ['value'],
  watch: {
    value: function(v) {
      this.$emit('input', v);
    }
  }
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
