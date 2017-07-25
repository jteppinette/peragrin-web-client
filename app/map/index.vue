<template>
<div class="map">
  <organization-sidebar :organization="organization"></organization-sidebar>
  <communities-map :show-filter="true" :community="community" @select="select" v-if="community"></communities-map>
</div>
</template>

<script>
import organizationSidebar from './organization-sidebar';
import communitiesMap from 'common/communities/map';

export default {
  data: () => ({communities: [], community: undefined, organization: undefined}),
  mounted: initialize,
  methods: {select},
  components: {organizationSidebar, communitiesMap}
};

function initialize() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities)
    .then(communities => {
      let query = (this.$route.query.community || '').toLowerCase().replace(/\s+/g, '');
      if (query) return this.community = communities.find(c => c.name.toLowerCase().replace(/\s+/g, '') === query) || communities[0];
      return this.community = communities[0];
    });
}

function select(o) {
  var hours = this.$http.get(`/organizations/${o.id}/hours`).then(response => response.data);
  var promotions = this.$http.get(`/organizations/${o.id}/promotions`).then(response => response.data);
  return Promise.all([hours, promotions])
    .then(values => this.organization = {...o, hours: values[0], promotions: values[1]});
}
</script>

<style lang="stylus">
.map {
  .leaflet-container {
    position: fixed;
    height: 100% !important;
    z-index: 1;
    top: 53px;
  }
}

.organization-drawer {
  z-index: 7 !important;
  border: 0;
  padding: 0px;

  &.navigation-drawer--open {
    width: 400px;
    max-width: 90vw;
  }

  .expansion-panel__header {
    min-height: 60px;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: inherit;

    > div {
      margin-right: 30px
    }
  }

  .tabs-no-border {
    .tabs__items {
      border-style: none;
    }
  }
}
</style>
