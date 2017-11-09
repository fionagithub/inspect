import cloneDeep from 'lodash.clonedeep'
import StringToTime from './date'
//判断数据不否存
let ifDataNull = function (d) {
  return d === null ? '-' : d;
};
//判断是否是数组
let dataNotExist = function (d) {
  let data = [];
  if (d instanceof Array) {
    d.forEach(function (v, i) {
      data.push(ifDataNull(v));
    });
  } else {
    data = ifDataNull(d);
  }
  return data;
};
const echarts = {
  //标准型
  xparse(opt, data, conf, _date) {
    opt = cloneDeep(opt)
    conf = cloneDeep(conf)
    
    let _series = [],
    values = data.values,
    _lgd = data.z.data;
    if ('legend' in opt) {
      opt.legend.data = _lgd;
    }
    values.forEach(function (v, i) {
      let _type = {},
      _data = v.data,
      _name = v.name;
      if (_name in conf) {
        _type = conf[_name];
      } else {
        _type = conf['default'];
        _type.name = _name;
      }
      // console.log('[];;;', _type)
      
      _type.data = dataNotExist(_data);
      _series.push(_type);
    });
    if (_date) {
      opt.xAxis.data = StringToTime(data.x.data, _date);
    }else{
      opt.xAxis.data = data.x.data;
    }
    opt.series = _series;
    return opt;
  },
  // 服务器出错
  error: {
    graphic: [{
      type: 'text',
      left: 'center',
      top: 'middle',
      z: 100,
      style: {
        fill: '#3f3f3f',
        text: '服务器开小差，请稍后再试。',
        font: '16px Microsoft YaHei'
      }
    }],
    series: []
  }
}
export default echarts
