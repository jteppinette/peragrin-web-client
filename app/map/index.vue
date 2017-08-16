<template>
<div>

  <v-container v-if="!$route.query.community && !initializedLocation && !community" style="text-align: center; padding-top: 15vh">
    <h1>Finding a Community Near You</h1>
    <p>approve the location service notification to allow access to your location</p>
    <a href="mailto:support@peragrin.com">support@peragrin.com</a><br>

    <v-progress-circular :indeterminate="true" class="mt-3"></v-progress-circular>
  </v-container>

  <communities-map v-if="initializedLocation && !community" :communities="communities" :self="self"></communities-map>

  <community-map v-if="initializedCommunity && community" :community="community" :distance="distance" :self="self"></community-map>

</div>
</template>

<script>
import communityMap from './community-map';
import communitiesMap from './communities-map';

export default {
  data: () => ({initializedCommunity: false, initializedLocation: false, self: undefined, communities: [], community: undefined}),
  mounted: initialize,
  components: {communityMap, communitiesMap},
  methods: {initializeLocation, initializeCommunity, getDistance},
  computed: {
    distance () {
      return (this.self && this.community) ? this.getDistance(this.self, [this.community.lat, this.community.lon]) : undefined;
    }
  },
  watch: {
    '$route.query.community' (v) {
      return this.initializeCommunity(v);
    }
  }
};

function initialize() {
  let communities = this.$http.get('/communities').then(({data: communities}) => this.communities = communities)
  let location = this.initializeLocation().catch(() => undefined);
  return communities
    .then(() => this.initializeCommunity(this.$route.query.community))
    .then(() => this.initializedCommunity = true)
    .then(() => location)
    .then(() => {
      if (!this.self) return;
      this.communities = this.communities.map(c => ({...c, distance: this.getDistance(this.self, [c.lat, c.lon])}));
      this.communities.sort((a, b) => a.distance - b.distance);
    })
    .then(() => this.initializedLocation = true);
}

function initializeCommunity(name='') {
  return this.community = (name && this.communities.length) ? this.communities.find(c => c.name == name) : undefined;
}

function initializeLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject();
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      return resolve(this.self = [latitude, longitude]);
    }, reject);
  });
}

// Mean Earth Radius, as recommended for use by
// the International Union of Geodesy and Geophysics,
// see http://rosettacode.org/wiki/Haversine_formula
const R = 3959; // miles

// distance between two geographical points using spherical law of cosines approximation
function getDistance(from, to) {
	var rad = Math.PI / 180,
      fromLat = from[0] * rad,
      toLat = to[0] * rad,
      a = Math.sin(fromLat) * Math.sin(toLat) + Math.cos(fromLat) * Math.cos(toLat) * Math.cos((to[1] - from[1]) * rad);
	return (R * Math.acos(Math.min(a, 1))).toFixed(2);
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
