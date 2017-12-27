<template>
<q-layout>
    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.push('/index')">
        <i>arrow_back</i>
      </button>
      <q-toolbar-title :padding="1">
        报障清单
      </q-toolbar-title>
    </div>
  <div class="layout-view">
    <div class="layout-padding" v-if="tktDtl">
      <div class="card">
        <div class="card-content">
          <div class="item multiple-lines d-base">
            <div class="d-label"> 系统 </div>
            <div class="d-val">
              {{ tktDtl.system|tran(getConfMenu.system) }}</div>
          </div>
          <div class="item multiple-lines d-base">
            <div class="d-label"> 报障来源 </div>
            <div class="d-val" v-if='tktDtl.source' >
              {{tktDtl.source.type|tran(getConfMenu.source) }}
            </div>
          </div>
          <div class="item multiple-lines d-base">
            <div class="d-label"> 优先级 </div>
            <div class="d-val d-prty">
              <q-rating class="orange n-rating " disable v-model="prty" :max="priorityMax"></q-rating>
              <span> {{prty|tran(getConfMenu.priority) }} </span>
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
              {{ tktDtl.reportTime |date('HH:mm') }}
            </div>
          </div>
          <div class="item multiple-lines d-base">
            <div class="d-label">转发报障:</div>
            <div class="d-val" v-for="(item, index) in  tktDtl.tags " :key="index" >
              <span class="chip label bg-grey-4"> {{item }} </span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="item multiple-lines">
            <div class="item-content">
              <div class="item-label">当前状态:</div>
              <q-select class="full-width add-state" type="list" v-model="status" :options="getConfMenu.state"></q-select>
            </div>
          </div>
          <div class="item multiple-lines">
            <div class="item-content">
              <div class="item-label">补充说明:</div>
              <textarea class="full-width desc" v-model="stateDesc"> </textarea>
            </div>
          </div>
          <!--<pre>{{flag }} {{ status.length==0}}</pre>-->
          <q-progress-button :disabled="unAddBtn" :percentage="progressBtn" @click.native="updateDB(tktDtl.id)" indeterminate class="d-add-btn teal full-width">
            提交
          </q-progress-button>
          <p class="caption">处理记录:</p>
          <div class="timeline">
            <div class="timeline-item" v-for="(n, index) in tktDtl.state"  :key="index" >
              <div class="timeline-badge">
                <i>alarm</i>
              </div>
              <div class="timeline-title">
                {{n.name|tran(getConfMenu.state) }}
              </div>
              <div class="timeline-date text-italic d-date">
                <div>
                  {{n.time|date('HH:mm') }}
                </div>
              </div>
              <div class="card-content timeline-content" v-if="n.stateComment">
                <p>
                  {{n.stateComment }}
                </p>
              </div>
              <div class="timeline-date text-italic timeline-footer">
                <div class="d-recorder">
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

</q-layout>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapActions,
    mapState
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "jpush",
    data() {
      return {
        progressBtn: 0,
        stateDesc: '',
        flag: false,
        status: '',
      }
    },
    watch:{
      $route(to, from){
      //  console.log('--jjj--', to)
        to&&to.params&&to.params.id&&this.getJpushData(to.params.id)
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.getJpushData()
        Win_tickets_.on('patched', pes => {
          this.getTkt(pes.id)
        })
      })
    },
    computed: {
      ...mapGetters(['getGlbErr', 'getConfMenu']),
      ...mapState(['priorityMax']),
      ...mapGetters('tickets', {
        tktDtl: 'current',
      }),
      prty() {
        return parseInt(this.tktDtl.priority)
      },
      unAddBtn() {
        let _disabled
        if (this.getGlbErr.isFlag == false) {
          if (this.flag == true) {
            _disabled = true
          } else {
            _disabled = this.status.length == 0 ? true : false
          }
        } else {
          this.progressBtn = 0
          _disabled = this.status.length == 0 ? true : false
        }
        return _disabled
      },
    },
    filters: {
      priortity(data) {
        return parseInt(data)
      },
    },
    methods: {
      getJpushData(id){
         id=id||this.$route.params.id
        if(window.jpushUri.path){
          window.jpushUri.path =null
        } 
        this.setError()
        this.getTkt(id)
      },
      ...mapActions(['setError']),
     ...mapActions('tickets', {
        patchTkt: 'patch',
      }),
      ...mapActions('tickets', {
        getTkt: 'get',
      }),
      notify() {
        this.$router.push('/ticket')
      },
      updateDB(id) {
        this.flag = true
        this.progressBtn = 1
        this.patchTkt([id, {
          state: parseInt(this.status),
          stateComment: this.stateDesc
        }]).then(res => {
          this.flag = false
          this.status = ''
          this.progressBtn = 0
          this.stateDesc = ''
          Toast.create('提交成功.')
       //  console.log('-patch-success-', this.tktDtl)
        })
      },
    },
    destroyed: function () {
      this.setError()
     // console.log("已销毁");
    },
  }

</script>
<style>
  .d-base {
    display: flex;
    padding: 10px 0;
  }
  .add-state{
    height: 34px;
  }
  .d-label {
    color: #A6A6A6;
    font-size: 12px;
    flex: 1;
  }

  .d-prty {
    display: flex;
    justify-content: space-between;
  }

  .d-val {
    font-size: 16px;
    font-weight: 400;
    color: #606060;
    line-height: 20px;
    flex: 3;
  }

  .d-recorder {
    align-self: flex-end;
    font-size: .9rem;
    color: #999;
  }

  .timeline-content {
    padding: 8px 16px;
  }

  .timeline-footer {
    min-height: .1rem;
  }

</style>
