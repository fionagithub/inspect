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
    <q-tabs slot="navigation" :refs="$refs" v-model="tabNo">
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
          <div v-if="message">
            <div class="card-media">
              <img src="../img/water.jpg">
              <button class="green circular d-status"><i>check</i></button>
            </div>
            <div class="card-title d-title">
              <div>{{message.name}} </div>
            </div>
            <div class="card-content list no-border highlight">
              <div class="item multiple-lines d-lines ">
                <div class="item-content row items-center">
                  <div class="item-label">安装位置</div>
                  <div class="item-title">
                    {{message.location.building+"|"+message.location.floor+"|"+message.location.room}}

                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label">当前状态</div>
                  <div class="item-title">
                    {{'正常' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label"> 指标读数</div>
                  <div class="item-title">
                    {{' A:999 B:888 C:333' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label">更新时间</div>
                  <div class="item-title">
                    {{message._modifyTime |date('HH:mm:ss') }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label">维修记录</div>
                  <a class="item-title"  @click="setTab()">

                    {{'8次' }}</a>
                </div>
              </div>
            </div>
            <div class="card-actions card-no-top-padding">
              <div class="text-lime" v-for='item in message.tags'>
                {{item}}
              </div>
              <div class="auto"></div>
              <button class="primary clear small" @click='goTicket()' ><i class="on-left">directions</i> 我要报障</button>
            </div>
          </div>
        </div>
        <div class="card" ref="tab-2">
          <div>
            {{message}}
          </div>
        </div>
        <div class="card" ref="tab-3">
          <div class="list item-inset-delimiter no-border">
            <div class="item item-link multiple-lines" v-for="index in 8 ">
              <i class="item-primary">mail</i>
              <div class="item-content has-secondary">
                <div>
                  Nothing...
                </div>
              </div>
              <i class="item-secondary icon">keyboard_arrow_right</i>
            </div>
          </div>

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
    mapActions
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  export default {
    name: "detail",
    data() {
      return {
        tabNo:'tab-1'
      }
    },
    computed: {
      ...mapGetters('devices', {
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
    methods: {
      ...mapMutations('devices', {
        clear: 'clearCurrent'
      }),
      ...mapActions('devices', {
        findMessages: 'get',
      }),
      goTicket(){
        this.$router.push({
          path: '/ticket/new'
        })
      },
      setTab(){
        this.tabNo='tab-3'
        console.log(this.setActiveTab)

      },
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
            timeout: 3000
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
  .d-status {
    left: 28px;
    right: 0;
  }

  .d-title {
    margin-top: 50px;
    padding: 0 15px;
  }
.d-lines{
  width: 100%;
}
.item-label{
  flex: 1;
}
.item-title{
  flex:2;
}
</style>
