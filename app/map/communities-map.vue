<template>
<div>

  <v-map ref="map" :zoom="11" :center="[communities[0].lat, communities[0].lon]" class="control-right">
    <v-tilelayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoianRlcHBpbmV0dGUtcGVyYWdyaW4iLCJhIjoiY2oxb2phcGY0MDAzajJxcGZvc29wN3ExbyJ9.xtRkiXQAS-P6VOO7B-dEsA"></v-tilelayer>
    <v-marker v-for="community in communities" :icon="icon" @l-click="dialogs.choose[community.id] = true" :key="community.id" v-if="community" :lat-lng="[community.lat, community.lon]">
      <v-tooltip :content="community.name"></v-tooltip>
    </v-marker>
  </v-map>

  <confirm-dialog v-for="community in communities" :key="community.id" v-model="dialogs.choose[community.id]" @confirmed="() => $router.push(`/map?community=${community.name}`)">Are you sure you want to enter the community, {{ community.name }}?</confirm-dialog>

</div>
</template>

<script>
import {MARKERS} from 'common/categories';
import confirmDialog from 'common/confirm-dialog';

let dialogs = {
  choose: {}
};

export default {
  props: ['communities'],
  data: () => ({dialogs, icon: MARKERS['Community Leader']}),
  mounted: initialize,
  components: {confirmDialog}
};

function initialize() {
  this.dialogs.choose = this.communities.reduce((obj, c) => ({...obj, [c.id]: false}), {});
}
</script>

<style scoped lang="stylus">
.vue2leaflet-map {
  position: fixed;
  height: 100% !important;
  z-index: 1;
  top: 53px;
}
</style>
