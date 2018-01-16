import {
   SETERR,
 SETERROR,
 GETGLBERR,
 SETCONFMENU,
 SETADDCOUNT,
 SETBLETOGGLED,
 SETJPUSHDATA,
 SETFEATHERS,
} from './mutation-types'
export const mutations = {
  [SETERR](state){
    state.global_err_tips = {
      isFlag: false,
      loginUri: null,
      tips: null,
    }
  },
  [SETERROR](state, obj){
   // console.log('--=-=-',obj)
    state._error = obj
  },
  [GETGLBERR](state, obj) {
    for (let i in state.global_err_tips){
      state.global_err_tips[i]=obj[i]
    }
  },
  [SETCONFMENU](state, obj) {
    for (let i in state.confMenu){
      if(i in obj){
        state.confMenu[i]=obj[i]
      }
    }
  },
  [SETADDCOUNT](state, obj){
    for (let i in obj){
    //  console.log('-=-', obj[i] )
      state.add_count[i]=obj[i]
    }
  },
  [SETBLETOGGLED](state, obj){
    state.bleToggled=obj
  },
  [SETJPUSHDATA](state, obj){
    state.jpushData=obj
  },
  [SETFEATHERS](state, obj){
    state.feathersServer = obj
  }
}
