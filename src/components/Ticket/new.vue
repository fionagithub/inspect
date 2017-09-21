<template>
  <q-layout>
    <div slot="header" class="toolbar">
        <button class="head_goback" @click="$router.go(-1)">
          <i>arrow_back</i>
        </button> 
        <q-toolbar-title :padding="1">
          新增报障 
        </q-toolbar-title>
        <popover></popover>
      </div>
    <div class="layout-view" >
      <div class="layout-padding ">
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">系统:</div>
            <q-select class="full-width" type="list" v-model="system" :options="systemItems"></q-select>
          </div>
        </div>
        <div class="item">
          <div class="item-content row items-center wrap">
            <div class="item-label">优先级:</div>
            <q-rating class="orange n-rating " v-model="priority" :max="priorityMax"></q-rating>
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">报障时间:</div>
            <q-datetime class="full-width red" v-model="stateTime" type="datetime" :ok-label='okLabel' :cancel-label='cclLabel' :clear-label='clrLabel'></q-datetime>
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">报障描述:</div>
            <textarea class="full-width new-desc" v-model="description"> </textarea>
          </div>
        </div>
        <!--<pre>$v: {{ $v }}</pre>-->
        <div class="add-btn">
          <button class="teal full-width" @click="add()" :disabled="$v.$dirty==$v.$invalid==false">提交</button>
        </div>
      </div>
      <div class="row justify-center" style="margin-bottom: 50px;" v-if="tips">
        <router-link class="text-red" to='/login' v-if='Islogined'> {{tips}} </router-link>
        <span v-else>  {{tips}} </span>
      </div>
    </div>
  </q-layout>
</template>

<script>
  import moment from 'moment'
  import {
    required,
    sameAs,
    between,
    minLength
  } from 'vuelidate/lib/validators'
  import {
    mapMutations,
    mapActions,
    mapGetters,
    mapState
  } from 'vuex'
   import popover from '../layout/popover'
 import {
    Toast
  } from 'quasar'
  import {_new} from './data'
  export default {
    name: "new",
    data() {
      let _dt = {
        stateTime: moment().format(),
        tips: null,
        Islogined: false
      }
      return Object.assign(_dt, _new)
    },
    created() {
    },
    mounted(){
    },
    computed:{
      ...mapState(['systemItems','priorityMax', 'stateItems']),

    },
    methods: { 
      ...mapMutations('tickets', {
        clear: 'clearCurrent'
      }),
      ...mapActions('tickets', {
        createMessages: 'create',
      }),
      add() {
        let data = {
          "priority": parseInt(this.priority),
          "system": this.system,
          "reportTime": this.stateTime,
          "description": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            this.$router.go(-1)
            // console.log('-=-=', res)
          })
          .catch(error => {
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            console.log('-=:[]', error)
            this.Islogined=error.code==401?true:false
            this.tips =error.code==401? '认证失败，请重新登录': '哦,服务崩溃，稍后再试'
            Toast.create.negative({
              html: this.tips,
              timeout: 3000
            })
          })
      }
    },
    plugins: ['vuelidate'],
    components: {
      popover
    },
    destroyed: function () {
      this.clear() // 置空ticket-vuex      
      console.log("已销毁");
    },
    validations: {
      description: {
        required,
        minLength: minLength(4)
      }
    }
  }

</script>
<style>
  .add-btn {
    margin-top: 50px;
  }

  .new-desc {
    height: 80px;
  }

  .form-group__message {
    display: none;
    font-size: .95rem;
    color: #CC3333;
    margin-left: 10em;
    margin-bottom: 12px;
  }

  .form-group--error+.form-group__message {
    display: block;
    color: #CC3333;
  }
</style>
