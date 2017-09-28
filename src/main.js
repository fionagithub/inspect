// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
    // 2. or, use next line to activate DEFAULT QUASAR STYLE
    // require(`quasar/dist/quasar.${__THEME}.css`)
    // ==============================
import moment from 'moment'
import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './config/store'
import feathersClient from './api/feathers-config'
import './config/filters'
import Vuelidate from 'vuelidate'
import {
    mapActions,
    mapState
} from 'vuex'
Vue.use(Vuelidate)
moment.locale('zh-cn');
Vue.use(Quasar) // Install Quasar Framework
    // window.screen.lockOrientation('portrait')
    // setInterval authenticate
window.feathers = feathersClient

Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
        el: '#q-app',
        computed: {
            ...mapState('auth', ['payload', 'user']),
        },
        created() {
            if (!this.user) {
                console.log('---mmm--cc---')
                this.setAuth()
            }
        },
        watch: {
            user(obj) {
                if (obj) {
                    this.getAuth()
                    this.getConf()
                }
            }

        },
        methods: {
            ...mapActions('metadata', {
                findStateItems: 'find',
            }),
            getConf() {
                this.findStateItems().then(res => {
                    let _array, sum = {}
                    for (var item in res) {
                        let data = res[item]
                        let _list = data['is']
                        sum[data['id']] = _list
                        if (data['id'] == 'state') {
                            _array = [{
                                value: 'ALL',
                                label: '全部状态'
                            }]
                            this.$store.state.stateItems = _list.concat(_array)
                        }
                        if (data['id'] == 'system') {
                            _array = [{
                                value: 'ALL',
                                label: '全部系统'
                            }]
                            this.$store.state._system = _list.concat(_array)
                        }
                    }
                    console.log('[-!!!--]', sum)
                    this.$store.state._state = sum.state
                    this.$store.state._priority = sum.priority
                    this.$store.state.systemItems = sum.system
                })
            },
            ...mapActions('auth', [
                'authenticate'
            ]),
            setAuth() {
                let _self = this
                _self.authenticate().then((response) => {
                     let redirect = decodeURIComponent(_self.$route.query.redirect || '/');
                    console.log('ok--from main!!!!!',redirect);
                     _self.$router.push(redirect)
                }).catch((error) => {
                    _self.$router.push('/login')
                    console.log('Error--from main!!!!!', error);
                });
            },
            getAuth() {
                let _self = this
                let Exp_Date = _self.payload.exp;
                let Exp_DAY = moment(parseInt(Exp_Date + '000')).subtract('minutes', 5)
                    // let Exp_DAY = moment().add('seconds', 5)
                let time = Exp_DAY - moment()
                console.log('--!!!import:::exp--', time)
                setTimeout(() => {
                    console.log('--!!!import:::setAuth--')
                    this.setAuth()
                }, time);
            },
        },
        router, //
        store,
        render: h => h(require('./App'))
    })
})