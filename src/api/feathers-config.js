import 'babel-polyfill'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import socketio from 'feathers-socketio'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'
import store from '../config/store'
/*const socket = io('http://192.168.123.125:3030', {
transports: ['websocket']
})*/

const socket = io('http://192.168.123.129:3031', {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth({
    storage: window.localStorage
  }))
  .configure(feathersVuex(store, {
    auth: {
      userService: '/users'
    }
  }))
  // feathersClient.service('/message')
 feathersClient.service('/users')

export default feathersClient
