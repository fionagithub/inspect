<template>

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
            <div class="d-val">
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
        </div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="item multiple-lines">
            <div class="item-content">
              <div class="item-label">当前状态:</div>
              <q-select class="full-width" type="list" v-model="status" :options="getConfMenu.state"></q-select>
            </div>
          </div>
          <div class="item multiple-lines">
            <div class="item-content">
              <div class="item-label">补充说明:</div>
              <textarea class="full-width desc" v-model="stateDesc"> </textarea>
            </div>
          </div>
         <!-- <pre>{{flag }}  {{ status.length==0}}</pre>-->
          <button class="d-add-btn teal full-width" :disabled="flag==true||status.length==0" @click="updateDB(tktDtl.id)">提交</button>
          <p class="caption">处理记录:</p>
          <div class="timeline">
            <div class="timeline-item" v-for="n in tktDtl.state">
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
    name: "detail",
    data() {
      return {
        stateDesc: '',
        flag: false,
        status: '',
      }
    },
    computed: {
      ...mapGetters(['getConfMenu']),
      ...mapGetters('tickets', {
        tktDtl: 'current',
      }),
      ...mapState(['priorityMax']),
      prty() {
        if (this.tktDtl) {
          return parseInt(this.tktDtl.priority)
        }
      }
    },
    filters: {
      priortity(data) {
        return parseInt(data)
      },
    },
    methods: {
      ...mapActions('tickets', {
        patchTkt: 'patch',
      }),
      updateDB(id) {
        this.flag = true
        this.patchTkt([id, {
          state: parseInt(this.status),
          stateComment: this.stateDesc
        }]).then(res => {
          this.flag = false
          this.status = ''
          this.stateDesc = ''
          Toast.create('提交成功.')
          console.log('-patch-success-', this.tktDtl)
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
