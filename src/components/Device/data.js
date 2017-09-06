const l_state = [{
    value: '未处理',
    label: '未处理'
  }, {
    value: '处理中',
    label: '处理中'
  }, {
    value: '已处理',
    label: '已处理'
  }, {
    value: 'ALL',
    label: '全部状态'
  }],
  n_state = [{
    value: '未处理',
    label: '未处理'
  }, {
    value: '处理中',
    label: '处理中'
  }, {
    value: '已处理',
    label: '已处理'
  }],
  _system = [{
      label: '弱电',
      value: '弱电',
    },
    {
      label: '强电',
      value: '强电',
    }, {
      label: "保洁",
      value: '保洁'
    }, {
      label: "消防",
      value: '消防'
    }, {
      label: "给排水",
      value: '给排水'
    }, {
      label: "其他",
      value: '其他'
    }
  ],
  _time = [{
    value: 'NOW',
    label: '今天'
  }, {
    value: 'WEEK',
    label: '本周'
  }, {
    value: 'MONTH',
    label: '本月'
  }, {
    value: 'ALL',
    label: '全部时间'
  }];

export const _list = {
  tips: null,
  fetched: true,
  isLoading: true,
  searchModel: '',
  limit: 10,
  skip: 0,
  selectType: 'ALL',
  selectTime: 'ALL',
  SearchLabel: '搜索...',
  items_time: _time,
  items_type: l_state
}
export const _new = {
  stateName: "未处理",
  description: "",
  system: '弱电',
  priority: 0,
  priorityMax: 3,
  clrLabel: '清空',
  cclLabel: '取消',
  okLabel: '设置',
  selectstateName:n_state,
  selectsystem: _system
}
