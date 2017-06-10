<template>
<v-list two-line>

  <!-- PHONE -->
  <v-list-item v-if="organization.phone">
    <v-list-tile>
      <v-list-tile-action>
        <v-icon class="primary--text">phone</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title><a :href="'tel:'+organization.phone">{{ organization.phone }}</a></v-list-tile-title>
        <v-list-tile-sub-title>Phone</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list-item>

  <!-- EMAIL -->
  <v-list-item v-if="organization.email">
    <v-list-tile>
      <v-list-tile-action>
        <v-icon class="primary--text">mail_outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title><a :href="'mailto:'+organization.email">{{ organization.email }}</a></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list-item>

  <!-- WEBSITE -->
  <v-list-item v-if="organization.website">
    <v-list-tile>
      <v-list-tile-action>
        <v-icon class="primary--text">link</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title><a :href="organization.website">{{ organization.website }}</a></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list-item>

  <!-- ADDRESS -->
  <v-list-item v-if="organization.street">
    <v-list-tile>
      <v-list-tile-action>
        <v-icon class="primary--text">location_on</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title><a :href="'geo:'+organization.lat+','+organization.lon">{{ organization.street }}</a></v-list-tile-title>
        <v-list-tile-sub-title>{{ organization.city}} , {{ organization.state }} {{ organization.zip }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list-item>

  <!-- HOURS OF OPERATION -->
  <v-list-item v-if="hours">
    <v-list-tile>
      <v-list-tile-action>
        <v-icon class="primary--text">access_time</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ weekdays[today] }}</v-list-tile-title>
        <v-list-tile-sub-title>
          <span v-for="v in hours" class="text-xs-left pr-3">{{ v.start | to12hr }} - {{ v.close | to12hr }}</span>
        </v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list-item>

</v-list>
</template>

<script>
import {WEEKDAYS, to12hr} from 'common/time';

export default {
  data: () => ({weekdays: WEEKDAYS, today: new Date().getDay()}),
  props: {
    organization: {type: Object, required: true},
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
