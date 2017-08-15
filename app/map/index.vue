<template>
<div>

  <communities-map v-if="initialized && !community && communities.length" :communities="communities"></communities-map>

  <community-map v-if="initialized && community" :community="community"></community-map>

</div>
</template>

<script>
import communityMap from './community-map';
import communitiesMap from './communities-map';

export default {
  data: () => ({initialized: false, communities: [], community: undefined}),
  mounted: initialize,
  components: {communityMap, communitiesMap},
  watch: {
    '$route.query.community' (v) {
      this.community = (v && this.communities.length) ? this.communities.find(c => c.name == v) : undefined;
    }
  }
};

function initialize() {
  return this.$http.get('/communities')
    .then(({data: communities}) => this.communities = communities)
    .then(() => this.community = (this.$route.query.community && this.communities.length) ? this.communities.find(c => c.name == this.$route.query.community) : undefined)
    .then(() => this.initialized = true);
}
</script>

<style lang="stylus">
.control-right .leaflet-control-container {
  position: fixed !important;
  right: 52px !important;
  z-index: 2000 !important;

  @media screen and (max-width: 599px) {
    display: none;
  }
}
</style>
