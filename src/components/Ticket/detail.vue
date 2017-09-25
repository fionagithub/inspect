<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button> 
      <q-toolbar-title :padding="1">
        报障详情 
      </q-toolbar-title>
      <popover></popover>
    </div>
    <div class="layout-view" >
      <div class="layout-padding">
        <div v-if="message">
          <div class="card">
            <div class="card-content">
            <div class="item multiple-lines d-base">
                <div class="d-label"> 系统 </div>
                <div class="d-val">
              {{ message.system|tran(systemItems) }}</div>
              </div>
              <div class="item multiple-lines d-base">
                <div class="d-label"> 报障来源 </div>
                <div class="d-val">
                  {{ message.source|getTyped }}
                </div>
              </div>
              <div class="item multiple-lines d-base" >
                <div class="d-label"> 优先级 </div>
                <div class="d-val d-prty">    
                  <q-rating class="orange n-rating " disable v-model="prty" :max="priorityMax"></q-rating>
                  <span> {{prty|tran(_priority) }} </span>
                </div>
              </div>
              <div class="item multiple-lines d-base">
                <div class="d-label"> 报障描述 </div>
                <div class="d-val">
                  {{ message.description }}</div>
              </div>
              <div class="item multiple-lines d-base">
                <div class="d-label">报障时间:</div>
                <div class="d-val">
                  {{ message.reportTime |date('HH:mm')  }}
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-content">
              <div class="item multiple-lines">
                <div class="item-content">
                  <div class="item-label">当前状态:</div>
                  <q-select class="full-width" type="list" v-model="state" :options="_state"></q-select>
                </div>
              </div>
              <div class="item multiple-lines">
                <div class="item-content">
                  <div class="item-label">补充说明:</div>
                  <textarea class="full-width desc" v-model="stateDesc"> </textarea>
                </div>
              </div>
              <button class="d-add-btn teal full-width" :disabled='btnFlag' @click="updateDB(message.id)">提交</button>
              <p class="caption">处理记录:</p>
              <div class="timeline">
                <div class="timeline-item" v-for="n in message.state">
                  <div class="timeline-badge">
                    <i>alarm</i>
                  </div>
                  <div class="timeline-title">
                    {{n.name|tran(_state) }}
                  </div>
                  <div class="timeline-date text-italic d-date">
                    <div>
                      {{n.time|date('HH:mm') }} 
                    </div>
                  </div>
                    <div class="card-content timeline-content" v-if="n.stateComment" >
                      <p>
                      {{n.stateComment }}
                      </p>
                    </div>
                  <div class="timeline-date text-italic timeline-footer">
                    <div class="d-recorder" >
                      {{ n.recorder }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--<pre>$v: {{ $v }}</pre>-->
        </div>
        <div class="row justify-center" style="margin-bottom: 50px;" v-if="tips">
          <router-link to='/login' v-if='Islogined'> {{tips}} </router-link>
          <span v-else>  {{tips}} </span>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
    import popover from '../layout/popover'
 import {
    mapGetters,
    mapMutations,
    mapActions,
    mapState
  } from 'vuex'
  import {Toast} from 'quasar'
  export default {
    name: "detail",
    data() {
      return {
        stateDesc: '',
        flag:false,
        btnFlag:true,
        state: '',
        tips: null,
        message:{},
        Islogined:false
     }
    },
    computed: {
      ...mapState(['systemItems','_priority','priorityMax', '_state']),

      prty(){
        if(this.message){
           return parseInt(this.message.priority)
        }
      }
    },
    watch:{
      state(n,o){
        if(n!==''){
         this.btnFlag=false
        }else{
          this.btnFlag=true
        }
        if(this.flag){
          this.btnFlag=true
        }
        console.log('[]', n,  this.btnFlag)
      }

    },
    components: {
      popover
    },
    created() {
    },
    mounted() {
      this.getMessage()
     
    },
    filters: {
      priortity(data) {
        return parseInt(data)
      },
      getTyped(obj){
        let _map={
          manual:'人工填报',
          system:'系统填报'
        }
        if(obj){
          return _map[obj.type]
        }
      }
    },
    methods: {
      ...mapMutations('tickets', {
        clear: 'clearCurrent'
      }),
      ...mapActions('tickets', {
        findMessages: 'get',
      }),
      ...mapMutations('tickets', {
        ptdtkt:'updateItem'
      }),
      ...mapActions('tickets', {
        patchMessages: 'patch',
      }),
      updateDB(id) {
        this.flag = true
        this.patchMessages([id, {
          state:parseInt(this.state),
          stateComment: this.stateDesc
        }]).then(res => {
          this.flag = false
          this.state = ''
          this.stateDesc = ''
          this.message=res
          Toast.create('提交成功.')
          console.log('-patch-success-',this.message )
        })
      },
      getMessage() {
        let _self = this
        const id = _self.$route.params.id
        _self.findMessages(id).then(res=>{
          this.message=res
        }).catch(error => {
          let type = error.errorType
          error = Object.assign({}, error)
          error.message = (type === 'uniqueViolated') ?
            'That is unavailable.' :
            'An error prevented sign.'
          console.log('-=:[]', error)
          this.Islogined=error.code==401?true:false
          this.tips =error.code==401? '认证失败，请重新登录': '哦,服务崩溃，稍后再试'
          Toast.create.negative({
            html:this.tips ,
            timeout: 3000
          })
        })
      }
    },
    destroyed: function () {
   //  this.clear() // 置空ticket-vuex      
    //  console.log("已销毁");
    },
  }

</script>
<style>
  .d-base {
    display: flex;
    padding: 10px 0;
  }
  
  .d-val {
    font-size: 14px;
    font-weight: 300;
    color: #606060;
    line-height: 20px;
    flex: 3;
  }
  .d-recorder{
    align-self: flex-end;
    font-size: .9rem;
    color: #999;
  }
  .timeline-content{
    padding: 8px 16px;
  }
  .timeline-footer{
    min-height: .1rem;
  }
  .d-label {
    color: #A6A6A6;
    font-size: 12px;
    flex: 1;
  }
.d-state{
  font-size: 14px;
}
.d-prty{
  display: flex;
  justify-content: space-between;
}
  </style>
