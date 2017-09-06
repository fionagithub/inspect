<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div v-if="message[0]">
        <div class="card">
          <div class="card-content">
            <!-- <div>
              <div class="item-content">
              </div>
            </div> -->
            <div class="item multiple-lines d-base">
              <div class="d-label"> 系统 </div>
              <div class="d-val">
                {{ message[0].system }}</div>
            </div>
            <div class="item multiple-lines d-base">
              <div class="d-label"> 优先级 </div>
              <div class="d-val">
                {{ message[0].priortity|priortity }}</div>
            </div>
            <div class="item multiple-lines d-base">
              <div class="d-label"> 报障描述 </div>
              <div class="d-val">
                {{ message[0].description }}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="item multiple-lines">
              <div class="item-content">
                <div class="item-label">当前状态:</div>
                <q-select class="full-width" type="list" v-model="state" :options="selectState"></q-select>
              </div>

            </div>
            <div class="item multiple-lines">
              <div class="item-content">
                <div class="item-label">状态描述:</div>
                <textarea class="full-width desc" v-model="stateDesc"> </textarea>
              </div>

            </div>
            <button class="add-btn teal full-width" :disabled='this.state==""' @click="updateDB(message[0].id)">提交</button>

            <div class="timeline">
              <div class="timeline-item" v-for="n in message[0].state">
                <div class="timeline-badge">
                  <i>alarm</i>
                </div>
                <div class="timeline-title">
                  {{n.name}}
                </div>
                <div class="timeline-date text-italic">
                  <div>
                    <!-- {{n.staff+n.stateDesc}}-->
                    {{n.time|moment }} </div>
                </div>
              </div>
            </div>
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
  import moment from 'moment'
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
        stateDesc: '',
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
    filters: {
      priortity(data) {
        var _map = {
          0: '一般',
          1: '紧急',
          2: '非常紧急',
        };
        return _map[data]
      },
      moment(date) {
        var _format;
        var _days = moment().diff(date, 'days')
        if (_days == 0) {
          _format = 'HH:mm'
        } else {
          if (_days < 365) {
            _format = 'M月D日 HH:mm'
          } else {
            _format = 'Y年M月D日 HH:mm'
          }
        }
        return moment(date).format(_format);
      }
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
          popover: '开发中',
          show: {
            bar: true,
          },
          direction: true
        }
        this.setNav(obj)
      },
      updateDB(id) {
        //  console.log(this.stateDesc)
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
  .d-base {
    display: flex;
    padding: 10px 0;
  }

  .add-btn {
    margin: 20px 0;
  }

  .d-val {
    font-size: 14px;
    color: #606060;
    line-height: 20px;
    flex: 3;
  }

  .d-label {
    color: #A6A6A6;
    font-size: 12px;
    flex: 1;
  }

</style>
