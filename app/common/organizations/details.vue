<template>
<v-list two-line>

  <!-- PHONE -->
  <v-list-tile v-if="organization.phone" :href="'tel:'+organization.phone">
    <v-list-tile-action><v-icon class="primary--text">phone</v-icon></v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ organization.phone }}</v-list-tile-title>
      <v-list-tile-sub-title>Phone</v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>

  <!-- EMAIL -->
  <v-list-tile v-if="organization.email" :href="'mailto:'+organization.email">
    <v-list-tile-action><v-icon class="primary--text">mail_outline</v-icon></v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ organization.email }}</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>

  <!-- WEBSITE -->
  <v-list-tile v-if="organization.website" :href="organization.website">
    <v-list-tile-action><v-icon class="primary--text">link</v-icon></v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ organization.website }}</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>

  <!-- ADDRESS -->
  <v-list-tile v-if="organization.street" :href="'geo:'+organization.lat+','+organization.lon">
    <v-list-tile-action><v-icon class="primary--text">location_on</v-icon></v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ organization.street }}</v-list-tile-title>
      <v-list-tile-sub-title>{{ organization.city}} , {{ organization.state }} {{ organization.zip }}</v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>

  <!-- HOURS OF OPERATION -->
  <v-list-tile v-if="hours">
    <v-list-tile-action><v-icon class="primary--text">access_time</v-icon></v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ weekdays[today] }}</v-list-tile-title>
      <v-list-tile-sub-title>
        <span v-for="v in hours" class="text-xs-left pr-3">{{ v.start | to12hr }} - {{ v.close | to12hr }}</span>
      </v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>

</v-list>
</template>

<script>
import {WEEKDAYS, to12hr} from 'common/time';

export default {
  data: () => ({weekdays: WEEKDAYS, today: new Date().getDay()}),
  props: {
    organization: {type: Object},
  },
  filters: {
    to12hr: value => to12hr(value)
  },
  computed: {
    hours () {
      if (!this.organization.hours || !this.organization.hours.length) return undefined;
      return this.organization.hours.filter(v => v.weekday === this.today);
    }
  }
};
</script>

<style scoped lang="stylus">
a {
  text-decoration: none;
  color: inherit;
}
</style>
