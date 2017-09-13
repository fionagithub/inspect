<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout>
    <toolbar slot="header" v-show="nav.show.bar" :head-title="nav.title" :popover-title="nav.popover" :go-back='nav.direction'></toolbar>
    <drawer v-show="nav.show.drawer" ></drawer>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </q-layout>
  </div>
</template>

<script> 
import moment from 'moment'
import {
  mapActions,
  mapState
} from 'vuex'
  import toolbar from 'components/layout/toolbar.vue'
  import drawer from 'components/layout/drawer.vue'
  export default { 
    computed:{ 
      ...mapState('auth', ['payload']),
      ...mapState(['nav'])
    }, 
    components: {
      toolbar,
      drawer
    },
    created(){
      if(this.payload){
        this.getAuth()
      }else{
       this.setAuth()
      }
    },
    methods:{
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
        console.log('--!!!import:::exp--', time)
        setTimeout(() => {
          console.log('--!!!import:::setAuth--')
          this.setAuth()
        }, time);
      },
    }

  }

</script>

<style></style>
