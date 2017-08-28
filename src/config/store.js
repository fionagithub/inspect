import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

let state = {
  title: '',
  search: false,
  show: {
    bar: false,
    drawer: false,
  },
  direction: ''
}

let mutations = {
  setBar(state, value) {
    state.direction = value.direction
    state.title = value.title
    state.show = value.show
    state.search = value.search
  }
}

export default new Vuex.Store({
  state,
  mutations
  
})
