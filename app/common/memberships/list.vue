<template>
<div style="position: relative">

  <v-btn v-if="isAdministrator" @click.stop="dialogs.createUpdate = !dialogs.createUpdate" fab absolute top right><v-icon>add</v-icon></v-btn>
  <memberships-create-update v-if="isAdministrator" v-model="dialogs.createUpdate" :communityID="communityID" @created="() => initializeMemberships()"></memberships-create-update>

  <v-card-text v-if="isAdministrator && memberships.length && initialized" class="secondary">Click a membership below to manage its members.</v-card-text>

  <v-card-title v-if="isAdministrator && !memberships.length && initialized" class="secondary subheading">Why create a membership?</v-card-title>
  <v-card-text v-if="isAdministrator && !memberships.length && initialized">
    <p>Memberships allow your community to support a <strong>donor map perks program</strong>.<p>
    <p>After creating an initial membership level, patrons will have the ability to acquire a membership with your community and <strong>redeem promotions at participating businesses</strong>.</p>
    <p>This allows your community to take in membership revenue and provide your partner businesses with an aditional advertising channel.</p>
  </v-card-text>
  <v-card-actions v-if="isAdministrator && !memberships.length && initialized" class="secondary">
    <v-spacer></v-spacer>
    <v-btn outline class="white--text" href="mailto:info@peragrin.com?subject=How to Setup a Donor Map">Contact Peragrin</v-btn>
  </v-card-actions>

  <v-card-text v-if="!isAdministrator && !memberships.length && initialized">
    <p>This community does not support a donor map perks program.</p>
    <p>Reach out to your community leader for more information.</p>
  </v-card-text>

  <v-divider v-if="isAdministrator && memberships.length"></v-divider>

  <v-list two-line>
    <v-list-tile :to="isAdministrator ? `/communities/${communityID}/memberships/${membership.id}` : undefined" v-for="membership in memberships" :key="membership.id" v-if="membership">
      <v-list-tile-content>
        <v-list-tile-title avatar>{{ membership.name }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ membership.description }}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action v-if="isAdministrator">
        <v-btn icon class="secondary" @click.stop.prevent="dialogs.confirm[membership.id] = true"><v-icon class="white--text">delete</v-icon></v-btn>
      </v-list-tile-action>
      <confirm-dialog v-model="dialogs.confirm[membership.id]" @confirmed="del(membership.id)">Are you sure you want to delete the membership: {{ membership.name }} ?</confirm-dialog>
    </v-list-tile>
  </v-list>

</div>
</template>

<script>
import membershipsCreateUpdate from 'common/memberships/create-update';
import confirmDialog from 'common/confirm-dialog';

let dialogs = {
  createUpdate: false,
  confirm: {}
};

export default {
  props: ['communityID', 'isAdministrator'],
  data: () => ({memberships: [], dialogs, initialized: false}),
  mounted: initialize,
  methods: {initializeMemberships, del},
  components: {membershipsCreateUpdate, confirmDialog}
}

function initialize() {
  return this.initializeMemberships()
    .then(() => this.initialized = true);
}

function initializeMemberships() {
  return this.$http.get(`/communities/${this.communityID}/memberships`)
    .then(({data: memberships}) => this.memberships = memberships)
    .then(memberships => this.dialogs.confirm = memberships.reduce((obj, m) => ({...obj, [m.id]: false}), {}));
}

function del(id) {
  return this.$http.delete(`/memberships/${id}`)
    .then(this.initializeMemberships);
}
</script>
