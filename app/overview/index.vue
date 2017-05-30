<template>
<v-container fluid class="pa-3">
  <v-layout row wrap>

    <v-flex xs12 lg8>
      <v-card v-if="community">
        <v-card-title class="primary">{{ community.name }}</v-card-title>
        <community-organizations-list :id="community.id"></community-organizations-list>
      </v-card>
      <v-card v-if="organization">
        <v-card-title class="primary"> Promotions
          <v-spacer></v-spacer>

          <v-dialog v-model="addPromotionDialog" width="400px">
            <v-btn floating slot="activator" class="white"><v-icon dark>add</v-icon></v-btn>
            <v-card>
              <v-card-row><v-card-title class="primary">Add Promotion</v-card-title></v-card-row>
              <v-card-row>
                <v-card-text>
                  <form @keyup.enter="addPromotion">

                    <v-text-field v-model="promotion.name" label="Name"></v-text-field>
                    <v-text-field v-model="promotion.description" label="Description" rows="1" multi-line></v-text-field>
                    <v-text-field v-model="promotion.exclusions" label="Exclusions" rows="1" multi-line></v-text-field>

                    <v-subheader class="pa-0" style="height: 0px">Is Single Use?</v-subheader>
                    <v-switch v-model="promotion.isSingleUse" :label="promotion.isSingleUse ? 'This promotion can only be used a single time per patron.' : 'This promotion can be used multiple times by the same patron.'" dark></v-switch>

                  </form>
                </v-card-text>
              </v-card-row>
              <v-card-row actions>
                <v-btn flat @click.native="addPromotionDialog = false">Close</v-btn>
                <v-btn primary class="white--text" @click.native="addPromotion">Save</v-btn>
              </v-card-row>
            </v-card>
          </v-dialog>

        </v-card-title>
        <promotions-list :promotions="promotions" class="fab"></promotions-list>
      </v-card>
    </v-flex>

    <v-flex xs12 lg4 v-if="organization">
      <organization-card @community:selected="(community) => community = community" :organization="organization" :hours="hours" :communities="communities" class="elevation-1"></organization-card>
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
import communityOrganizationsList from 'common/community/organizations/list';
import organizationCard from 'common/organization/card';
import promotionsList from 'common/promotions/list';

var promotion = {
  name: '',
  description: '',
  exclusions: '',
  isSingleUse: false
};

export default {
  data: () => ({promotions: [], promotion, addPromotionDialog: false, organization: undefined, hours: [], community: undefined, communities: []}),
  components: {
    communityOrganizationsList,
    organizationCard,
    promotionsList
  },
  computed: {
    organizations () {
      return this.$store.state.account.organizations;
    }
  },
  methods: {assumeOrganization, addPromotion},
  watch: {
    organizations (v) {
      if (!v || !v.length) return;
      return this.assumeOrganization(v[0])
    }
  },
  mounted () {
    if (!this.organizations || !this.organizations.length) return;
    return this.assumeOrganization(this.organizations[0])
  },
  beforeRouteEnter (to, from, next) {
    next(sessionStorage.userID ? undefined : {path: '/auth/login', query: {redirect: to.fullPath}});
  }
};

function addPromotion() {
  this.$http.post(`/organizations/${this.organization.id}/promotions`, this.promotion)
    .then(() => this.addPromotionDialog = false)
    .then(initializePromotions)
}

function assumeOrganization(organization) {
  this.organization = organization;
  initializeHours.call(this);
  initializeCommunities.call(this);
  initializePromotions.call(this);
}

function initializeHours() {
  return this.$http.get(`/organizations/${this.organization.id}/hours`)
    .then(response => response.json())
    .then(hours => this.hours = hours);
}

function initializeCommunities() {
  return this.$http.get(`/organizations/${this.organization.id}/communities`)
    .then(response => response.json())
    .then(communities => this.communities = communities)
    .then(communities => this.community = communities[0]);
}

function initializePromotions() {
  return this.$http.get(`/organizations/${this.organization.id}/promotions`)
    .then(response => response.json())
    .then(promotions => this.promotions = promotions);
}
</script>
