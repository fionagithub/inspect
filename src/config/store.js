import Vuex from 'vuex'
import Vue from 'vue'
import { mutations } from './mutations'
import { state } from './states'

import * as actions from './actions'
Vue.use(Vuex) 
let getters = {
  getGlbErr(state) {
    return state.global_err_tips
  },
  getCtCut(state){
    return state.add_count
  },
  getConfMenu(state){
    return state.confMenu
  },
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations

})
