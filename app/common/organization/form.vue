<template>
<v-layout row wrap>
  <v-flex xs12 md6>
    <v-subheader>General</v-subheader>
    <v-text-field v-model="value.name" type="text" label="Name"></v-text-field>
    <v-text-field v-model="value.phone" type="text" label="Phone Number"></v-text-field>
    <v-text-field v-model="value.website" type="text" label="Website"></v-text-field>
  </v-flex>
  <v-flex xs12 md6>
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
  </v-flex>
</v-layout>
</template>

<script>
export default {
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
</style>
