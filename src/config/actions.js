import {
   SETERR,
 SETERROR,
 GETGLBERR,
 SETCONFMENU,
 SETADDCOUNT,
 SETECHARTCONF,
 SETBLETOGGLED,
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
export const setEchartConf = ({commit}, obj) => {
    commit(SETECHARTCONF, obj)
}
export const setBleToggled = ({commit}, obj) => {
    commit(SETBLETOGGLED, obj)
} 
