import 'babel-polyfill'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import socketio from 'feathers-socketio'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'
import store from './vuex/store'
import {
  setError
} from './vuex/actions'
function feathersClient(tantenid, uri, protocol) {
   uri =protocol + '://'+tantenid+'.'+uri
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
    console.log('----im connected[]-====')
  })
  client.service('/tickets')
  client.service('/devices')
  client.service('/system')

  client.service('/metadata')
  client.service('/feedback')
  client.service('/roles')
  client.service('/history_chart')
  client.hooks({
    error: function (hook) {
      setError(this, hook)
    //   console.log('--ff--hh--', hook)
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
