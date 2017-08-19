<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item to="/communities">Communities</v-breadcrumbs-item>
    <v-breadcrumbs-item disabled v-if="community">{{ community.name }}</v-breadcrumbs-item>
  </v-breadcrumbs>

  <!-- COMMUNITY -->
  <v-layout row wrap v-if="community">
    <v-flex xs12>
      <v-card>
        <v-card-title primary-title class="primary headline">{{ community.name }}</v-card-title>
        <v-card-text class="secondary" style="position: relative">
          <v-btn v-if="isAdministrator" @click.stop="dialogs.communitiesCreateUpdate = !dialogs.communitiesCreateUpdate" fab absolute top right><v-icon>edit</v-icon></v-btn>
          <communities-create-update v-model="dialogs.communitiesCreateUpdate" :community="community" @updated="c => initializeCommunity()"></communities-create-update>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>

  <!-- ORGANIZATIONS -->
  <v-layout row wrap v-if="community">
    <v-flex xs12>
      <v-card>
        <v-card-title primary-title class="primary headline">Organizations</v-card-title>
        <communities-organizations-list :community="community"></communities-organizations-list>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row wrap v-if="community">

    <!-- MEMBERSHIPS -->
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary title">Memberships</v-card-title>
        <memberships-list :communityID="id" :isAdministrator="isAdministrator"></memberships-list>
      </v-card>
    </v-flex>

    <!-- MAP -->
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="primary title">Map</v-card-title>
        <communities-map :community="community"></communities-map>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn outline flat class="white--text" :to="`/map?community=${community.name}`">Map</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

  </v-layout>

</v-container>
</template>

<script>
import communitiesCreateUpdate from 'common/communities/create-update';
import communitiesOrganizationsList from 'common/communities/organizations/list';
import communitiesMap from 'common/communities/map';
import membershipsList from 'common/memberships/list';

let dialogs = {
  communitiesCreateUpdate: false
};

export default {
  props: ['id'],
  data: () => ({community: undefined, dialogs}),
  components: {communitiesCreateUpdate, communitiesOrganizationsList, communitiesMap, membershipsList},
  computed: {
    isAdministrator () {
      return this.$store.state.account.isSuper || (this.$store.state.communities.indexOf(Number(this.id)) >= 0);
    }
  },
  mounted: initialize,
  methods: {initializeCommunity}
};

function initialize() {
  return this.initializeCommunity();
}

function initializeCommunity() {
  return this.$http.get(`/communities/${this.id}`)
    .then(({data: community}) => this.community = community);
}
</script>
