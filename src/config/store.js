import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
let state = {
  add_count:{

  tktCut: 0,
  dvCut: 0,
  },
  priorityMax: 3,
  stateItems: [],
  systemItems: [],
  _priority: [],
  _state: [], 
  _system:[]
}

let mutations = {}

export default new Vuex.Store({
  state,
  mutations

})
