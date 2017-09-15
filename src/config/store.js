import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
let state = {
   priorityMax: 3,
 stateItems: [],
  systemItems: [],
  _priority: [],
  _state:[],
}

let mutations = {}

export default new Vuex.Store({
  state,
  mutations

})
