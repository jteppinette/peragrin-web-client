<template>
<v-dialog v-model="value" lazy persistent scrollable width="400px">
  <v-card>

    <v-card-title class="title primary">Confirm</v-card-title>

    <v-card-text class="subheading"><slot>Are you sure you want to perform this action?</slot></v-card-text>

    <v-card-actions class="secondary">
      <v-spacer></v-spacer>
      <v-btn flat class="white--text" @click="$emit('input', false)">Close</v-btn>
      <v-btn outline class="white--text" @click="confirm">Confirm</v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>
</template>

<script>
export default {
  props: ['value'],
  methods: {confirm}
};

function confirm() {
  this.$emit('confirmed', true);
  this.$emit('input', false);
}
</script>
