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
const socket = io('http://192.168.123.240:3031', {
transports: ['websocket']
})
/*const socket = io('http://192.168.123.129:3031', {
  transports: ['websocket']
}) */
const feathersClient = feathers()
  .configure(hooks())
  .configure(socketio(socket,{timeout:5000}))
  .configure(auth({
    storage: window.localStorage,
   // timeout:2500
  }))
  .configure(feathersVuex(store, {
    auth: {
      userService: '/users'
    }
  }))

   feathersClient.service('/tickets')
   
   feathersClient.hooks({
    before(hook){
     // console.log('My custom before hook ran!');
    },
    error(hook){
     // console.log('======hook=======>', hook)
    },
  })
 //feathersClient.service('/users')
  /*
  id：loginId
  /tickets
  app.service('authentication')
    .hooks({
      before: {
        // You can chain multiple strategies on create method
        create: auth.hooks.authenticate(['jwt', 'local'])
      }
    });*/
export default feathersClient
