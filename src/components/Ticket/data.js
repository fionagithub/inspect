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
   }]
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
 }
 export const _new = {
   description: "",
   system: '100',
   priority: 1,
   clrLabel: '清空',
   cclLabel: '取消',
   okLabel: '设置',
 }
