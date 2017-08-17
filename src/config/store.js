import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

let state = {
  login: false,
  userInfo: '',
  layoutNeeded: true
}

let mutations = {
  out(state){
    state.login=false
    state.userInfo=''
  },
  setUser(state, value) {
    state.login = true
    state.userInfo = value
    console.log('---', value)
  },
  setLayoutNeeded(state, value) {
    state.layoutNeeded = value
  }
}

let getters = {
  getUserInfo() {
    return state.userInfo

  },
  getLayoutNeeded() {
    return state.layoutNeeded
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
