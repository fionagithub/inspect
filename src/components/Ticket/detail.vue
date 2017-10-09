<template>
  
  <div class="layout-view" >
    <div class="layout-padding">
      <err v-if="getErrFlag"/>
      <div v-if="tktDtl">
        <div class="card">
          <div class="card-content">
          <div class="item multiple-lines d-base">
              <div class="d-label"> 系统 </div>
              <div class="d-val">
            {{ tktDtl.system|tran(systemItems) }}</div>
            </div>
            <div class="item multiple-lines d-base">
              <div class="d-label"> 报障来源 </div>
              <div class="d-val">
                {{ tktDtl.source|getTyped }}
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
                {{ tktDtl.description }}</div>
            </div>
            <div class="item multiple-lines d-base">
              <div class="d-label">报障时间:</div>
              <div class="d-val">
                {{ tktDtl.reportTime |date('HH:mm')  }}
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
            <button class="d-add-btn teal full-width" :disabled='btnFlag' @click="updateDB(tktDtl.id)">提交</button>
            <p class="caption">处理记录:</p>
            <div class="timeline">
              <div class="timeline-item" v-for="n in tktDtl.state">
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
    </div>
  </div>
</template>

<script>
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
     }
    },
    computed: {
         ...mapGetters(['getErrFlag']),
   ...mapGetters('tickets', {
        tktDtl: 'current',
      }), 
      ...mapState(['systemItems','_priority','priorityMax', '_state']),
      prty(){
        if(this.tktDtl){
           return parseInt(this.tktDtl.priority)
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
      ...mapActions('tickets', {
        patchTkt: 'patch',
      }),
      updateDB(id) {
        this.flag = true
        this.patchTkt([id, {
          state:parseInt(this.state),
          stateComment: this.stateDesc
        }]).then(res => {
          this.flag = false
          this.state = ''
          this.stateDesc = ''
          this.tktDtl=res
          Toast.create('提交成功.')
          console.log('-patch-success-',this.tktDtl )
        })
      },
    },
  }

</script>
<style>
  .d-base {
    display: flex;
    padding: 10px 0;
  }
  
  .d-val {
    font-size: 16px;
    font-weight: 400;
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
  .d-prty{
    display: flex;
    justify-content: space-between;
  }
  </style>
