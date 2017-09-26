import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/Detail.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    { path: '/', component: load('Index') }, 
    { path: '/feedback', component: load('Feedback/template') }, 
    { path: '/login', component: load('Login') }, 
    { path: '/ticket', component: load('Ticket/template'),children:[
      {
        path: ':id',
        component: load('Ticket/deta') 
      },

    ]}, 
    { path: '/ticket/new', component: load('Ticket/new') }, 
    { path: '/device', component: load('Device/template') }, 
    { path: '/device/:id', component: load('Device/detail') }, 
    { path: '*', component: load('Error404') } // Not found
  ]
})
