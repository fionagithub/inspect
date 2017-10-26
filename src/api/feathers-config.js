import 'babel-polyfill'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import socketio from 'feathers-socketio'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'
import store from '../config/store'
import {
  setError
} from '../config/actions'
const socket = io({
  transports: ['websocket']
})
const feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket, {
    timeout: 5000
  }))
  .configure(auth({
    storage: window.localStorage
    // timeout:2500
  }))
  .configure(feathersVuex(store, {
    auth: {
      userService: '/users'
    },
  }))

feathersClient.service('/tickets')
feathersClient.service('/devices')
feathersClient.service('/system')

feathersClient.service('/metadata')
feathersClient.service('/feedback')

feathersClient.hooks({
  error: function (hook) {
    setError(this, hook)
  }.bind(store),
  before: function (hook) {
    setError(this)
  }.bind(store),
  after(hook) {
    // console.log('af')
  }
})

export default feathersClient
