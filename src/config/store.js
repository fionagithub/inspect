import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
function initNav(){
  let _nav={
    title: '',
    search: false,
    show: {
      bar: false,
      drawer: false,
    },
    direction: ''
  }
  return _nav
}
let state ={
  nav:new initNav()
}

let mutations = {
  setNav(state, value) {
    state.nav.direction = value.direction
    state.nav.title = value.title
    state.nav.show = value.show
    state.nav.search = value.search
  },
  initNav(){
    console.log('--restore navigation--')
   state.nav=new initNav()
  }
}

export default new Vuex.Store({
  state,
  mutations
  
})
