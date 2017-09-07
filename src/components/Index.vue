<template>
  <div class="index-page window-height window-width column items-center no-wrap">
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
    </div>
      <img class="index-img" src="../assets/bj_logo.png">
      <div class="index-menu  text-center" >
        <div class="row content-center text-center">
          <div class="auto link-btn" v-for="(item, index) in items" v-if="index-2<0">
            <router-link :to="item.uri">
              <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
          </button>
            </router-link>
          </div>
        </div>
        <div class="row content-center text-center">
          <div class="auto link-btn" v-for="(item, index) in items" v-if="index-2>=0">
            <router-link :to="item.uri">
              <button class="teal circular big " :disabled="item.disabled">
            {{item.title}}
          </button>
            </router-link>
          </div>
        </div>

      </div>
  </div>
</template>

<script>
  import 'src/assets/css/index.css'
  import {
    Dialog
  } from 'quasar' 
import moment from 'moment'
import {mapMutations,
  mapActions,
  mapState
} from 'vuex'
  export default {
    name: "index",
    data() {
      return {
        items: [{
          title: '报障',
          uri: '/device'
        }, {
          title: '故障',
          disabled: true,
          uri: '/device'
        }, {
          title: '设备',
          disabled: true,
          uri: '/alarm'
        }, {
          title: '巡检',
          disabled: true,
          uri: '/device'
        }]
      }
    },
    computed: {
      ...mapState('auth', [ 'payload']),
      leftDrawer() {
        return this.$parent.$children[1].$refs.leftDrawer
      }
    },
    created() {
      this.setNavInfo()
      if(this.payload){
        this.getAuth()
      }else{
       this.setAuth()
      }
    }, 
    methods: {
      ...mapActions('auth', [
        'authenticate'
      ]),
      setAuth() {
        let _self = this
        _self.authenticate().then((response) => {
          _self.getAuth()
        }).catch((error) => {
          _self.$router.push('/login')
          console.log('Error authenticating!', error);
        });
      },
      getAuth() {
        let _self = this
        let Exp_Date = _self.payload.exp;
        let Exp_DAY =moment(parseInt(Exp_Date +'000')).subtract('minutes', 5)
       // let Exp_DAY = moment().add('seconds', 5)
       let time = Exp_DAY - moment()
        console.log('--set--', time)
        setTimeout(() => {
          console.log('--setAuth--')
          this.setAuth()
        }, time);
      },
      ...mapMutations(['setNav']),
      alert() {
        Dialog.create({
          buttons: ['了解'],
          title: '抱歉',
          message: '目前尚处于原型开发阶段，部分功能有待完善'
        })
      },
      setNavInfo() {
        let obj = {
          show: {
            drawer: true,
          },
          popover: '首页管理'
        }
        this.setNav(obj)
      },
    },
  }

</script>
<style>
  .index-menu{
    margin: 30px;
    width: 80vw;
  }  
  .link-btn {
    margin: 20px 0;
  }

  .index-page .banner {
    width: 100vw;
  }
  .tb-btn{
    z-index: 9;
    color: white;
    background: transparent;
  }
  .index-img {
    margin-top: -50px;
    width: 100vw;
  }

</style>
