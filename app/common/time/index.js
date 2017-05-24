export const SUNDAY = 'Sunday', MONDAY = 'Monday', TUESDAY = 'Tuesday', WEDNESDAY = 'Wednesday', THURSDAY = 'Thursday', FRIDAY = 'Friday', SATURDAY = 'Saturday';
export const WEEKDAYS = [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY];

export function to24hr(str) {
  var arr = str.slice(0, -2).split(':');
  var military = (parseInt(arr[0])*100)+parseInt(arr[1]);

  if (arr[0] == '12' && str.endsWith('pm') && arr[1] == '00') {
    military = 2400;
  } else if (arr[0] == '12' && str.endsWith('am') && arr[1] == '00') {
    military = 1200;
  } else if (arr[0] !== '12' && str.endsWith('pm')) {
    military += 1200;
  } else if (arr[0] == '12' && str.endsWith('am')) {
    military -= 1200;
  }
  return military;
}

export function to12hr(v) {
  var hour = ((Math.floor((v/100) % 12)) || 12).toString();
  var minutes = format(v % 100);
  if (minutes == 0) {
    if (v == 1200) {
      return '12:00am';
    } else if (v == 2400) {
      return '12:00pm';
    }
  }

  if (v > 2400) {
    return hour + ':' + minutes + 'am';
  } else if (v > 1200) {
    return hour + ':' + minutes + 'pm';
  } else if (v < 1200) {
    return hour + ':' + minutes + 'am';
  }
  function format(number) {
     return (number < 10 ? '0' : '') + number
  }
}
