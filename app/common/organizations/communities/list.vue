<template>
<div>

  <template v-if="communities.length">
    <v-card-text class="secondary">Click a community below to view more detailed information.</v-card-text>
    <v-list two-line>
      <v-list-tile :to="`/communities/${community.id}`" v-for="community in communities" :key="community.id" v-if="community">
        <v-list-tile-content>
          <v-list-tile-title>{{ community.name }}</a></v-list-tile-title>
          <v-list-tile-sub-title v-if="community.isAdministrator">Administrator</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="isAdministrator">
          <v-btn icon class="secondary" @click.stop.prevent="dialogs.removeCommunity[community.id] = true"><v-icon class="white--text">remove</v-icon></v-btn>
        </v-list-tile-action>
        <confirm-dialog v-model="dialogs.removeCommunity[community.id]" @confirmed="remove(community.id)">Are you sure you want to remove this organization from the community, {{ community.name }}?</confirm-dialog>
      </v-list-tile>
    </v-list>
  </template>

  <div v-if="!communities.length && isAdministrator">
    <v-card-title class="secondary title">Why join a community?</v-card-title>
    <v-card-text class="expose">
      <p>Joining a community allows you to access a <strong>shared map, donor perks program, promotions, and many other Peragrin features</strong>.</p>
      <p>Contact us by clicking the button below to join a community near you.</p>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-spacer></v-spacer>
      <v-btn outline class="white--text" href="mailto:info@peragrin.com?subject=How to Join a Community">Contact Peragrin</v-btn>
    </v-card-actions>
  </div>

  <v-card-text v-if="!communities.length && !isAdministrator">
    <p>This organization does not belong to any communities.</p>
  </v-card-text>

</div>
</template>

<script>
import confirmDialog from 'common/confirm-dialog';

let dialogs = {
  removeCommunity: {}
};

export default {
  data: () => ({dialogs}),
  props: ['organizationID', 'communities', 'isAdministrator'],
  components: {confirmDialog},
  mounted () {
      return this.dialogs.removeCommunity = this.communities.reduce((obj, c) => ({...obj, [c.id]: false}), {});
  },
  watch: {
    communities () {
      return this.dialogs.removeCommunity = this.communities.reduce((obj, c) => ({...obj, [c.id]: false}), {});
    }
  },
  methods: {remove}
};

function remove(id) {
  return this.$http.delete(`/organizations/${this.organizationID}/communities/${id}`)
    .then(() => this.$emit('removed'));
}
</script>
