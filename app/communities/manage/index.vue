<template>
<v-container>

  <v-breadcrumbs>
    <v-breadcrumbs-item disabled>Communities</v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-layout row wrap>
    <v-flex xs12 md6 v-for="community in operating" :key="community.id" v-if="community">
      <v-card>
        <v-card-title primary-title class="primary headline">{{ community.name }}</v-card-title>
        <communities-map :community="community"></communities-map>
        <v-card-actions class="secondary">
          <v-spacer></v-spacer>
          <v-btn flat class="white--text" :to="`/communities/${community.id}`">{{ community.isAdministrator ? 'Manage' : 'View' }}</v-btn>
          <v-btn outline flat class="white--text" :to="`/map?community=${community.name}`">Map</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout v-if="account && account.isSuper" row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title class="primary title">Super Administrator</v-card-title>

        <v-card-text class="secondary" style="position: relative">
          <p>You are currently authenticated as a super administrator. This gives you access to manage all communities and organization in Peragrin.</p>
          <v-btn @click.stop="dialogs.communitiesCreateUpdate = !dialogs.communitiesCreateUpdate" fab absolute top right><v-icon>add</v-icon></v-btn>
          <communities-create-update v-model="dialogs.communitiesCreateUpdate" @created="c => initializeCommunities()"></communities-create-update>
        </v-card-text>

        <v-data-table :items="communities" :headers="headers" class="no-limit-select">
          <template slot="items" scope="props">
            <td class="text-xs-right"><router-link :to="`/communities/${props.item.id}`">{{ props.item.name }}</router-link></td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>
import communitiesMap from 'common/communities/map';
import communitiesCreateUpdate from 'common/communities/create-update';

const headers = [
  {text: 'Name', value: 'name', sortable: true},
];

let dialogs = {
  communitiesCreateUpdate: false
};

export default {
  data: () => ({headers, communities: [], operating: [], dialogs}),
  components: {communitiesMap, communitiesCreateUpdate},
  computed: {
    account () {
      return this.$store.state.account;
    }
  },
  mounted: initialize,
  methods: {initializeCommunities, initializeOperating}
};

function initialize() {
    return Promise.all([this.initializeOperating(), this.initializeCommunities()]);
}

function initializeOperating() {
  return this.$http.get(`/accounts/${this.account.id}/communities`)
    .then(({data: operating}) => this.operating = operating);
}

function initializeCommunities() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities);
}
</script>
