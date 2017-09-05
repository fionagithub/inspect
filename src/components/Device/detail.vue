<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div v-if="message[0]">
        <div class="card">
          <div class="card-content">
            系统: {{ message[0].system }}
            <div class="item-content">
              优先级: {{ message[0].priortity }}
            </div>
            <div class="item-title">
              报障描述:
            </div>
            <div class="item-content">
              {{message[0].description }}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-content"> 
            <div class="timeline">
              <div class="timeline-item" v-for="n in message[0].state">
                <div class="timeline-badge">
                  <i>alarm</i>
                </div>
                <div class="timeline-title">
                  {{n.name}}
                </div>
                <div class="timeline-date text-italic">
                  <div> {{n.time}} </div>
                </div> 
              </div>
            </div>
            <div class="item-label">当前状态:</div>
            <q-select class="full-width" type="list" v-model="state" :options="selectState"></q-select>
            <button class="add-btn teal full-width" @click="updateDB(message[0].id)">提交</button>
          </div>
        </div>
        <!--<pre>$v: {{ $v }}</pre>-->

      </div>
      <div class="row justify-center" style="margin-bottom: 50px;" v-if="tips">
        {{tips }}
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  import toolbar from 'components/layout/toolbar.vue'
  export default {
    name: "detail",
    data() {
      return {
        ready: false,
        stepperBtn: '',
        state: '',
        selectState: [{
          value: '未处理',
          label: '未处理'
        }, {
          value: '处理中',
          label: '处理中'
        }, {
          value: '已处理',
          label: '已处理'
        }],
        selectPriority: [{
          label: '一般',
          value: 0,
        }, {
          label: '紧急',
          value: 1,
        }, {
          label: '非常紧急',
          value: 2,
        }],
        tips: null,
      }
    },
    computed: {
      ...mapGetters('tickets', {
        message: 'list',
      })
    },
    components: {
      toolbar
    },
    created() {
      this.setNavInfo()
    },
    mounted() {
      this.getMessage()
    },
    methods: {
      ...mapMutations(['setNav']),
      ...mapMutations('tickets', {
        clear: 'clearAll'
      }),
      ...mapActions('tickets', {
        findMessages: 'find',
      }),
      ...mapActions('tickets', {
        patchMessages: 'patch',
      }),
      setNavInfo() {
        let obj = {
          title: '报障详情',
                           popover:'开发中',
  show: {
            bar: true,
          },
          direction: true
        }
        this.setNav(obj)
      },
      updateDB(id) {
        this.patchMessages([id, {
          state: this.state
        }]).then(res => {
          console.log('-patch-success-')
        })
      },
      getMessage() {
        let _self = this
        const id = _self.$route.params.id
        _self.findMessages({
          query: {
            id: id
          }
        }).catch(err => {
          _self.fetched = false
          _self.tips = '哦,服务开小差了'
          Toast.create.negative({
            html: '服务崩溃，稍后再试',
            timeout: 500
          })
        })
      }
    },
    destroyed: function () {
      this.clear() // 置空ticket-vuex      
      console.log("已销毁");
    },
  }

</script>
<style>
  .add-btn {
    margin: 10px 0;
  }
  .timeline{
    margin-bottom: 20px;
  }

</style>
