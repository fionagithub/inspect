import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
let state = {
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
  stateItems: [],
  systemItems: [],
  _priority: [],
  _state: [],
  _system: []
}
let getters = {
  getErrFlag(state) {
    return state.global_err_tips.isFlag
  },
  getLogUri(state) {
    return state.global_err_tips.loginUri
  },
  getErrTips(state) {
    return state.global_err_tips.tips
  },
}

let mutations = {}

export default new Vuex.Store({
  state,
  getters,
  mutations

})
