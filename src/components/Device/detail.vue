<template>
  <q-layout>

    <div slot="header" class="toolbar">
      <button class="head_goback" @click="$router.go(-1)">
        <i>arrow_back</i>
      </button>
      <q-toolbar-title :padding="1">
        设备详情
      </q-toolbar-title>
      <popover></popover>
    </div>
    <q-tabs slot="navigation" :refs="$refs" default-tab="tab-1">
      <q-tab name="tab-1">概览
      </q-tab>
      <q-tab name="tab-2">台帐
      </q-tab>
      <q-tab name="tab-3">维修记录
      </q-tab>
    </q-tabs>
    <div class="layout-view">
      <div class="layout-padding">
        <div class="card" ref="tab-1">
          <div class="card-media">
            <img src="../img/water.jpg">
            <button class="primary circular"><i>place</i></button>
          </div>
          <div class="card-content list no-border highlight">
            <div class="item two-lines">
              <i class="item-primary">local_bar</i>
              <div class="item-content">
                <div class="item-title">Bar XYZ</div>
                <div>Have a drink.</div>
              </div>
            </div>
            <div class="item two-lines">
              <i class="item-primary">local_gas_station</i>
              <div class="item-content">
                <div class="item-title">Gas Station</div>
                <div>Fill your gas tank.</div>
              </div>
            </div>
            <div class="item two-lines">
              <i class="item-primary">local_movies</i>
              <div class="item-content">
                <div class="item-title">Cinema XYZ</div>
                <div>Watch a movie.</div>
              </div>
            </div>
          </div>
          <div class="card-actions card-no-top-padding">
            <div class="text-lime">
              13 minutes
            </div>
            <div>
              (1 mile)
            </div>
            <div class="auto"></div>
            <button class="primary clear small"><i class="on-left">directions</i> Start</button>
          </div>
        </div>
        <div class="card" ref="tab-2">
          <div v-for="(item, key, index)  in message">
            {{item}} {{item }}
          </div>
        </div>
        <div class="card" ref="tab-3">.33..</div>
      </div>
    </div>
  </q-layout>
</template>

<script>
  import popover from '../layout/popover'
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "detail",
    data() {
      return {}
    },
    computed: {
      ...mapGetters('tickets', {
        message: 'current',
      }),
    },
    components: {
      popover
    },
    created() {},
    mounted() {
      this.getMessage()
    },
    filters: {
      priortity(data) {
        var _map = {
          1: '一般',
          2: '紧急',
          3: '非常紧急',
        };
        return _map[data]
      },
      typed(obj) {
        let _map = {
          manual: '人工填报',
          system: '系统填报'
        }
        return _map[obj]
      }
    },
    methods: {
      ...mapMutations('tickets', {
        clear: 'clearAll'
      }),
      ...mapActions('tickets', {
        findMessages: 'get',
      }),
      getMessage() {
        let _self = this
        const id = _self.$route.params.id
        _self.findMessages(id).catch(err => {
          let type = error.errorType
          error = Object.assign({}, error)
          error.message = (type === 'uniqueViolated') ?
            'That is unavailable.' :
            'An error prevented sign.'
          console.log('-=:[]', error)
          _self.fetched = false
          _self.tips = '哦,服务开小差了，请重新登录'
          Toast.create.negative({
            html: '服务崩溃，稍后再试',
            timeout: 1000
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
