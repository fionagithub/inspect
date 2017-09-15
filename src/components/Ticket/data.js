import moment from 'moment'
 let _time = [{
     value: 'NOW',
     label: '今天'
   }, {
     value: 'WEEK',
     label: '最近七天'
   }, {
     value: 'MONTH',
     label: '最近一个月'
   }, {
     value: 'ALL',
     label: '全部时间'
   }],
   _moment = moment(0, "h"),
   timeMap = {
     NOW: _moment.toISOString(),

     WEEK: _moment.subtract(7, 'days').toISOString(),

     MONTH: _moment.subtract(1, 'months').toISOString(),

   };
 export const _list = {
   tips: null,
   fetched: true,
   isLoading: true,
   searchModel: '',
   limit: 10,
   skip: 0,
   selectType: '0',
   selectTime: 'NOW',
   items_time: _time,
   timeMap: timeMap
 }
 export const _new = {
   description: "",
   system: '100',
   priority: 1,
   clrLabel: '清空',
   cclLabel: '取消',
   okLabel: '设置',
 }
