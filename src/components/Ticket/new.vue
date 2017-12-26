<template>
    <div class="layout-view" >
      <div class="layout-padding ">
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">系统:</div>
            <q-select class="full-width" type="list" v-model="systemSlt" :options="getConfMenu.system"></q-select>
          </div>
        </div>
        <div class="item">
          <div class="item-content row items-center wrap">
            <div class="item-label">优先级:</div>
            <q-rating class="orange n-rating " v-model="pty" :max="priorityMax"></q-rating>
            <span class="n-tx"> {{pty|tran(getConfMenu.priority) }} </span>
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
            <div class="item-label">转发报障:</div>
            <q-select class="full-width" type="checkbox" v-model="RoleSlt" :options="getConfRolers"></q-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">报障描述:</div>
            <textarea class="full-width new-desc" v-model="description"> </textarea>
            <div class="form-group--error" v-if="!$v.description.minLength">至少{{ $v.description.$params.minLength.min }}位...</div>
          </div>
        </div>
      <!--  <pre>$v: {{ $v.description }}</pre>-->
        <div class="add-btn">
          <!--<pre>{{flag }} {{ description.length==4}}</pre>-->
          <q-progress-button :disabled="unAddBtn" :percentage="progressBtn" @click.native="add()" indeterminate class="teal full-width">
            提交
          </q-progress-button>
        </div>
      </div>
    </div>
</template>
<script>
  import moment from 'moment'
  import Vue from 'vue'
  var selectTran = Vue.filter('tran')
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
        flag:false,
        progressBtn:0,
        stateTime: moment().format(),
      }
      return Object.assign(_dt, _new)
    },
    created() {
      this.setError()
    },
    mounted(){
    },
    computed:{
      ...mapState(['priorityMax']),
      ...mapState('auth', ['user']),
      ...mapState('roles', ['ids']),
      ...mapGetters(['getConfMenu','getGlbErr' ]),
      RoleSlt(){
        return this.user.roles
      },
      getConfRolers(){
       let getConfRolers=[]
         this.ids.map((res, index)=>{
          let role={label:res,value:res}
          getConfRolers.push(role)
        })
        return getConfRolers
      },
      unAddBtn(){
        let _disabled
        if (this.getGlbErr.isFlag==false){
          if(this.flag){
            _disabled = true
          }else{
            _disabled= this.description.length<4 ?true:false
          }
        }else{
            this.progressBtn=0
            _disabled=this.description.length<4? true :false
        }
        return _disabled
      },
    },
    methods: { 
      ...mapActions(['setError']),
      ...mapMutations('tickets', {
        clear: 'clearCurrent'
      }),
      ...mapMutations('tickets', {
        filterTkt: 'removeItem',
      }),
      ...mapActions('tickets', {
        createMessages: 'create',
      }),
      add() {
        this.flag=true
        this.progressBtn=1
        let data = {
          "priority": parseInt(this.pty),
          "system": this.systemSlt,
          "reportTime": this.stateTime,
          "description": this.description,
          "tags": this.RoleSlt,
        };
        this.createMessages(data)
          .then(res => {
            this.flag=false
            this.progressBtn=0
            this.filterTkt(res)
            Toast.create('提交成功.')
             this.$router.go(-1)
          // console.log('-=-=', res)
          })
      }
    },
    plugins: ['vuelidate'],
    components: {
      popover
    },
    destroyed: function () {
      this.setError()
      this.clear() // 置空ticket-vuex      
     // console.log("已销毁");
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
  .n-tx{
    flex: 1;
    text-align: right;
  }
</style>
