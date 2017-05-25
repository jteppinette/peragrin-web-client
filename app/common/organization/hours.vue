<template>
<v-layout row wrap>
  <v-flex xs12>
    <v-subheader>Hours of Operation</v-subheader>

    <div class="table__overflow">
    <table>
      <thead>
        <th></th>
        <th class="status"></th>
        <th></th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="(day, i) in hours">
          <td><strong>{{ weekdays[day.weekday] }}</strong></td>
          <td>
            <v-switch :label="day.status ? 'Open' : 'Closed'" primary v-model="day.status" light />
          </td>
          <td>
            <v-dialog v-if="day.status" lazy>
              <v-text-field slot="activator" v-model="day.start" type="text" label="Start"></v-text-field>
              <v-time-picker v-model="day.start"></v-time-picker>
            </v-dialog>
          </td>
          <td>
            <v-dialog v-if="day.status" lazy>
              <v-text-field slot="activator" v-model="day.close" type="text" label="End"></v-text-field>
              <v-time-picker v-model="day.close"></v-time-picker>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </table>
    </div>

  </v-flex>
</v-layout>
</template>

<script>
import {SUNDAY, WEEKDAYS, to12hr, to24hr} from 'common/time';

function update(weekday, value) {
  var idx = this.value.findIndex(v => v.weekday === weekday),
      start = to24hr(value.start),
      close = to24hr(value.close);
  if (value.status && idx < 0) {
    this.value.push({weekday, start: start, close: close});
  } else if (!value.status && idx >= 0) {
    this.value.splice(idx, 1);
  } else if (value.status && idx >= 0) {
    this.$set(this.value[idx], 'start', start);
    this.$set(this.value[idx], 'close', close);
  }
  this.$emit('input', this.value);
}

function from(weekday, hours) {
  var day = hours.find(v => v.weekday === weekday);
  return {weekday: weekday, status: !!day, start: day && day.start ? to12hr(day.start) : '9:00am', close: day && day.close ? to12hr(day.close) : '5:00pm'};
}

export default {
  data: () => ({weekdays: WEEKDAYS, hours: []}),
  props: ['value'],
  mounted: function() {
    for (var weekday = 0; weekday < WEEKDAYS.length; weekday++) { 
      this.hours.splice(weekday, 0, from(weekday, this.value));
      this.$watch('hours.'+weekday, update.bind(this, weekday), {deep: true});
    }
  }
}
</script>

<style scoped lang="stylus">
td > strong {
  display: block;
  padding-bottom: 10px;
}

table {
  width: 100%;
}

.subheader {
  padding: 0px;
}
th.status {
  min-width: 100px;
}
</style>
