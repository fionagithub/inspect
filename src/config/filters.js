import moment from 'moment'
import Vue from 'vue'

Vue.filter('tran', function (data, src) {
  if (src instanceof Array ) {
    var sum = {}
    for (var item in src) {
      sum[src[item].value] = src[item]['label']
    } 
      return sum[data] 
  }
})

Vue.filter('date', function (date, type) {
  if (date) {
    let _format
    let fmt = 'YYYYMMDD'
    let _Now = moment().format(fmt)
    let _date = moment(date).format(fmt)
    if (parseInt(_Now) == parseInt(_date)) {
      _format = 'HH:mm:ss'
    } else {
      let num = Math.pow(10, 4)
      if (parseInt(_Now / num) == parseInt(_date / num)) {
        _format = 'M月D日'
      } else {
        _format = 'Y年M月D日'
      }
      if (type) {
        _format += ' ' + type
      }
    }
    // console.log('[]',date, _format)
    return moment(date).format(_format);
  }
  return;
})
