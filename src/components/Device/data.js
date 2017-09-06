export default  {
        stateName: "未处理",
        description: "",
        system: '弱电',
        priority: 0,
        selectstateName: [{
          value: '未处理',
          label: '未处理'
        }, {
          value:'处理中' ,
          label: '处理中'
        }, {
          value: '已处理',
          label: '已处理'
        }],
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