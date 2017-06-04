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

  <v-list two-line>
    <v-list-item v-for="membership in memberships" :key="membership.id">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>{{ membership.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ membership.description }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-item>
  </v-list>

</div>
</template>

<script>
var membership = {
  name: '',
  description: ''
};

export default {
  props: ['communityID'],
  data: () => ({memberships: [], membership, dialog: false}),
  methods: {create},
  mounted: initialize
};

function initialize() {
  return this.$http.get(`/communities/${this.communityID}/memberships`)
    .then(response => response.json())
    .then(memberships => this.memberships = memberships);
}

function create() {
  return this.$http.post(`/communities/${this.communityID}/memberships`, this.membership)
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
