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
function feathersClient(tantenid, domain, protocol) {
  const uri =protocol + '://'+tantenid+'.'+domain
  const socket = io(uri || window.location.origin, {
    transports: ['websocket']
  })
  let serverUri={
    Tenant: {
      key: 'tenantid',
      value: tantenid
    },
    Procol: {
      key: 'protocolId' ,
      value: protocol 
    },
    Server:{
      key:'apiServer',
      value: domain
    }
  } 
   window.socket=socket
  socket.on('connect', function () {
    filtersStorage(serverUri.Tenant, 'save')
    filtersStorage(serverUri.Procol, 'save')
    filtersStorage(serverUri.Server, 'save')
    console.log('----im connected[]-====')
    const client = feathers()
      .configure(socketio(socket))
      .configure(hooks())
      .configure(auth({
        storage: window.localStorage
        // timeout:2500
      }))
      .configure(feathersVuex(store, {
        auth: {
          userService: '/users'
        },
      }))
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
      // console.log('--ff--hh--', hook)
      }.bind(store),
      before: function (hook) {
        setError(this)
      }.bind(store),
      after(hook) {
      }
    }) 
    store.state.feathersServer = client
 })

  socket.on('connect_error', (error) => {
   // socket.close()
    console.log('connect_error---');
    store.state.feathersServer = null
 });

socket.on('reconnection', function() {
    console.log("重新连接到服务器");
});
}

export default feathersClient
