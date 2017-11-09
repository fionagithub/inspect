let from24To12 = function (time) {
  if (time > 12 & time < 24) {
    return time - 12
  } else {
    return time
  }
};
let tranTwo = function (d) {
  let data;
  if (parseInt(d) < 10) {
    data = '0' + d
  } else {
    data = d
  }
  return data

};

function TranTime(d, t) {
  let x, time = d;

  switch (t) {
    case t = 'week':
      switch (time.getDay()) {
        case 0:
          x = "周日";
          break;
        case 1:
          x = "周一";
          break;
        case 2:
          x = "周二";
          break;
        case 3:
          x = "周三";
          break;
        case 4:
          x = "周四";
          break;
        case 5:
          x = "周五";
          break;
        case 6:
          x = "周六";
          break;
        default:
          x = "时间错误"
      }
      break;
    case t = 'fulltime':
      x = time.getFullYear() + '-' + (time.getMonth() - (-1)) + '-' + time.getDate() + ' ' + tranTwo(from24To12(time.getHours())) + ':' + tranTwo(time.getMinutes()) + ':' + tranTwo(time.getSeconds());
      break;
    case t = 'fulltime24':
      x = time.getFullYear() + '-' + (time.getMonth() - (-1)) + '-' + time.getDate() + ' ' + tranTwo(time.getHours()) + ':' + tranTwo(time.getMinutes()) + ':' + tranTwo(time.getSeconds());
      break;
    case t = 'delsecfulltime':
      x = time.getFullYear() + '-' + (time.getMonth() - (-1)) + '-' + time.getDate() + ' ' + tranTwo(from24To12(time.getHours())) + ':' + tranTwo(time.getMinutes());
      break;
    case t = 'delsecfulltime24':
      x = time.getFullYear() + '-' + (time.getMonth() - (-1)) + '-' + time.getDate() + ' ' + tranTwo(time.getHours()) + ':' + tranTwo(time.getMinutes());
      break;
    case t = 'time':
      x = tranTwo(from24To12(time.getHours())) + ':' + tranTwo(time.getMinutes()) + ':' + tranTwo(time.getSeconds());
      break;
    case t = 'delsectime':
      x = tranTwo(from24To12(time.getHours())) + ':' + tranTwo(time.getMinutes());
      break;
    case t = 'time24':
      x = tranTwo(time.getHours()) + ':' + tranTwo(time.getMinutes()) + ':' + tranTwo(time.getSeconds());
      break;
    case t = 'delsectime24':
      x = tranTwo(time.getHours()) + ':' + tranTwo(time.getMinutes());
      break;
    case t = 'date':
      x = time.getFullYear() + '-' + (time.getMonth() - (-1)) + '-' + time.getDate();
      break;
    case t = 'dateTime':
      x = time.getFullYear() + '/' + (time.getMonth() - (-1)) + '/' + time.getDate() + '/' + time.getHours();
      break;
    case t = 'dateTime-two':
      x = time.getFullYear() + '/' + tranTwo(time.getMonth() - (-1)) + '/' + tranTwo(time.getDate()) + '/' + tranTwo(time.getHours());
      break;
    case t = 'day':
      x = time.getDate();
      break;
    case t = 'month':
      x = (time.getMonth() - (-1));
      break;
    case t = 'year':
      x = time.getFullYear();
      break;
    case t = 'MM-dd':
      x = (time.getMonth() - (-1)) + '-' + time.getDate();
      break;
  }
  return x
};
//时间戳转时间
function StringToTime(dt, t) {
  let _date;

  if (dt instanceof Array) {
    _date = [];
    dt.forEach(function (v, i) {
      _date.push(TranTime(new Date(parseInt(v)), t));
    })
  } else {
    _date = TranTime(new Date(parseInt(dt)), t)
  }
  console.log('--')
  return _date;
}
export default StringToTime
