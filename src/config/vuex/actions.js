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

export const setErr = ({commit}) => {
    commit(SETERR)
}
export const setError = ({commit}, obj) => {
    commit(SETERROR, obj)
}
export const getGlbErr = ({commit}, obj) => {
    commit(GETGLBERR, obj)
}
export const setConfMenu = ({commit}, obj) => {
    commit(SETCONFMENU, obj)
}
export const setAddCount = ({commit}, obj) => {
    commit(SETADDCOUNT, obj)
} 
export const setBleToggled = ({commit}, obj) => {
    commit(SETBLETOGGLED, obj)
} 

export const setJpushData = ({commit}, obj) => {
    commit(SETJPUSHDATA, obj)
} 
export const setFeathersData = ({commit}, obj) => {
    commit(SETFEATHERS, obj)
} 
