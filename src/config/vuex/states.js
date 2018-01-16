 export const state = {
  HttpsMap:{
    true:"https",
    false:"http"
  },
  feathersServer:false,
  add_count: {
    tktCut: 0,
    dvCut: 0,
  },
  _error: null,
  global_err_tips: {
    isFlag: false,
    loginUri: null,
    tips: null,
  },
  priorityMax: 3,
  jpushData:{},
  confMenu:{
    source: [],
    system: [],
    _system_: [],
    priority: [],
    state: [],
    _state_: [],
  }
} 