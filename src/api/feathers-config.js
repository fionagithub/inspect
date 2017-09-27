import 'babel-polyfill'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import socketio from 'feathers-socketio'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'
import store from '../config/store'

const API_HOST = process.env.NODE_ENV === 'development' ? 'http://192.168.123.240:3033' : window.location.origin.replace(/:\/\/m\./g, '://api-beta.')
const socket = io(API_HOST, { transports: ['websocket'] })
const feathersClient = feathers()
    .configure(hooks())
    .configure(socketio(socket, { timeout: 5000 }))
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
feathersClient.service('/devices')

feathersClient.service('/metadata')
feathersClient.service('/feedback')

feathersClient.hooks({
    before(hook) {
        // console.log('My custom before hook ran!');
    },
    error(hook) {
        // console.log('======hook=======>', hook)
    },
})
export default feathersClient