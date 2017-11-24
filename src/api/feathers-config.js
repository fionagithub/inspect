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

function feathersClient(uri) {
 // uri='http://192.168.123.189:3030'
  uri = 'https://shtower.laputacloud.com'
  const socket = io(uri || window.location.origin, {
    transports: ['websocket']
    
  })
  const client = feathers()
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
  socket.on('connect', function () {
    console.log('[]-im connected[]-=')
  })
  client.service('/devices')
  //client.service('/system')

  //client.service('/metadata')
  client.service('/feedback')
  client.service('/smarttag')
  // monitorid+deviceid匹配不同的图表title
  // client.service('/monitors')
  client.service('/environment_chart')

  client.hooks({
    error: function (hook) {
      setError(this, hook)
       console.log('--ff--hh--', hook)
    }.bind(store),
    before: function (hook) {
      setError(this)
    }.bind(store),
    after(hook) {
    }
  }) 

  return client;
}

export default feathersClient
