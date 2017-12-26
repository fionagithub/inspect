 <template>
  <div class="index-page window-height window-width column items-center">
    <div class="banner">
      <div class="toolbar tb-btn">
          <button @click="leftDrawer.open()">
            <i>menu</i>
          </button>
          <button>
            <i>more_vert</i>
            <q-popover ref="popover" anchor="top left" self="bottom left" class="bg-white text-black">
              <div class="list highlight ">
                <div class="item">
                  <button class="defalut" @click="alert()">首页管理 </button>
                </div>
              </div>
            </q-popover>
        </button>
      </div>
    <img class="index-img" src="../assets/img/bj_logo.png">
    </div>
  <div class="index-menu  text-center">
    <div class="row content-center text-center menu-row">
      <div class="auto link-btn" v-for="(item, index) in items" :key="index" v-if="index-2<0">
        <router-link :to="item.uri">
          <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
            <span class="floating circular label bg-dark bg-count" v-if='item.count' >{{ item.count}} </span>
          </button>
        </router-link>
      </div>
    </div>
    <div class="row content-center text-center menu-row">
      <div class="auto link-btn" v-for="(item, index) in items" :key="index" v-if="index-2>=0">
        <router-link :to="item.uri">
          <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
          </button>
        </router-link>
      </div>
    </div>

  </div>
  <div slot="footer" class="ftCon" >
      {{verson}}
  </div>
  <drawer></drawer>
  <q-modal ref="layoutModal" @close="notify('close')" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
    <feed-back v-if='isFb' />
    <setting v-if='isSetting' />
  </q-modal>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn');
  import feedBack from './Feedback/template'
  import setting from './Setting/template'
  import drawer from './layout/drawer.vue'
  import Vue from 'vue'
  import {
    mapGetters,
    mapMutations,
    mapState,
    mapActions
  } from 'vuex'
  import {
    Dialog
  } from 'quasar'
  export default {
    name: "index",
    data() {
      return {
        verson: '0.5.0 jpush',
        isSetting:false,
        isFb: false,
        tktCut: filtersStorage('tktCut') || null,
        items: [{
          title: '报障',
          uri: '/ticket',
          count:0
        }, {
          title: '抄表',
          disabled: true,
          uri: '/device'
        }, {
          title: '设备',
          uri: '/device'
        }, {
          title: '巡检',
          disabled: true,
          uri: '/device'
        }],
      }
    },
    computed: {
       ...mapState('auth', ['payload', 'user']),
      leftDrawer() {
        return this.$children[5].$refs.leftDrawer
      },
      _modal() {
        let _pa = this.$route.query
        return _pa
      },
      jpushTags(){
        return this.user.roles.concat([window.__tenantId__])
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.query._modal) {
          this[to.query._modal]()
        }
      },
      payload(val, oldVal){
        if(val){
          window.isIndex &&  this.getAuth()
        }
      }, 
     /*  //window.issueCount...
        this.getTktCunt()
     */
    },
    mounted() {
      this.getConf()
      this.setJpushTag() 
    },
    methods: {
      ...mapActions('tickets', {
        findTkt: 'find',
      }),
      ...mapActions(['setConfMenu','setError', 'setErr', 'getGlbErr']),
      ...mapActions('system', {
        findSystemItems: 'find',
      }),
      ...mapActions('metadata', {
        findStateItems: 'find',
      }),
      ...mapActions('roles', {
        findRoles: 'find',
      }),
      getConf(){
        window.isIndex && this.setConfig()
        this.setErr()
        this.findRoles()
        this.getTktCunt()
      },
      getAuth() {
        let _self = this
        let Exp_Date = _self.payload.exp;
        let Exp_DAY = moment(parseInt(Exp_Date + '000')).subtract('minutes', 5)
          //  console.log('--!!!import:::setAuth 1111--')
        // let Exp_DAY = moment().add('seconds', 5)
        let time = Exp_DAY - moment()
        setTimeout(() => {
            console.log('--!!!import:::setAuth--')
          this.setAuth()
        }, time);
      },
      setConfig(){
     //  window.isMobile && this.setJpushTag() 
        this.getConfMenu()
      },
      setJpushTag(){
        //为消息推送添加用户角色，使用setTags可以覆盖并重新定义的tag
       //  console.log('-=[]', this.jpushTags)
        window.isMobile && window.JPush.setTags({ sequence: 2, tags: this.jpushTags},
          (result) => {
            var sequence = result.sequence
            var tags = result.tags  // 数组类型
          }, (error) => {
            var sequence = error.sequence
            var errorCode = error.code
          })
      },
      getConfMenu() {
        let query = {
          query: {
            id: {
              $nin: ["system"]
            }
          }
        }
        this.findStateItems(query).then(res => {
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
              sum._state_ = _list.concat(_array)
            } 
          }
        //get system api
          this.setConfMenu(sum)
        })
        this.findSystemItems().then(ress=>{
          // console.log('[]-=', ress)
          let system = [], sum = {}
          for (let s in ress) {
            let _ress = ress[s],
              _system = {}
            for (let k in _ress) {
              let key = k == 'name' ? 'label' : 'value'
              _system[key] = _ress[k]
            }
            system.push(_system)
          }
          sum.system = system
          sum._system_ = system.concat([{
              value: 'ALL',
              label: '全部系统'
            }])
          this.setConfMenu(sum)
        })
        //初始化完毕，不再发起请求进行初始化配置
        window.isIndex=false
        
        //打开通知栏消息，启动应用，跳转jpush页面
          if(window.InitJpush){
            if(window.jpushUri.path){
              // alert('------menu-----')
              this.$router.push(window.jpushUri.path)
            }
            window.InitJpush=false
          }
      },
      Setting(){
        this.$refs.layoutModal.open()
        this.isSetting=true
      },
      getFd() {
        this.isFb = true
        this.$refs.layoutModal.open()
      },
      setCut(ttl) {
        this.items.map(function (k, i) {
          if (k.uri.indexOf('/ticket') == 0) {
            k.count = ttl
          }
        })
      },
      notify() {
        this.isSetting = false
        this.isFb = false
        this.setError()
        this.$refs.layoutModal.close();
      },
      getTktCunt() {
        let self = this
        this.findTkt({
          query: {
            $limit: 0,
            state: "0"
          }
        }).then(res => {
       //   console.log('--res---;', res)
          filtersStorage({
            value: res.total,
            key: 'tktCut'
          }, 'save')
          self.setCut(res.total)
        })
      },
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
    },
    components: {
      setting,
      feedBack,
      drawer,
    },
  }

</script>
<style>
body.cordova.mobile .index-img{
 margin-top: -70px;
}
  body.cordova.mobile .banner{
  padding-top: 20px;
}  

  .index-menu {
    padding-top:1rem;
    width: 80vw;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .index-page .banner {
    width: 100vw;
  }

  .tb-btn {
    z-index: 9;
    background: transparent;
  }

  .index-img {
    width: 100vw;
    position: relative;
    margin-top: -50px;
  }

  .bg-count {
    top: 0!important;
    width: 28px;
    height: 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    justify-content: center;
    overflow: hidden;
    color: black;
    background: #FDB617!important;
    padding: .3rem!important;
  }

  .menu-row {
    align-items: center;
    padding: 30px 10px;
  }
.ftCon{
    padding: 5px 0;
    color: gray;
    font-size: 10px;
}
</style>
