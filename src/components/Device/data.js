export default  {
        stateName: "NONE",
        description: "",
     //   stateTime:  moment().format(),
        system: '',
        priority: '',
        selectstateName: [{
          value: '已处理',
          label: '已处理'
        }, {
          value: '未处理',
          label: '未处理'
        }, {
          value:'处理中' ,
          label: '处理中'
        }],
        selectPriority: [{
          label: '一般',
          value: -1,
        }, {
          label: '紧急',
          value: 0,
        }, {
          label: '非常紧急',
          value: 1,
        }, ],  
        selectsystem: [{
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
        ]
      }