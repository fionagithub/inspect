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
      <q-tab name="tab-2" @selected="getMft()">台帐
      </q-tab>
      <q-tab name="tab-3" @selected="getRcd()">维修记录
      </q-tab>
    </q-tabs>
    <div class="layout-view">
      <div class="layout-padding">
        <div class="card" ref="tab-1">
          <div v-if="message">
            <div class="card-media">
              <img src="../img/building.jpg">
              <button class="green circular d-status"><i>check</i></button>
            </div>
            <div class="card-title d-title">
              <div>{{message.name}} </div>
            </div>
            <div class="card-content list no-border highlight">
              <div class="item multiple-lines d-lines ">
                <div class="item-content row items-center">
                  <div class="item-label dd-label">安装位置</div>
                  <div class="item-title dd-title">
                    {{message.location.building+"|"+message.location.floor+"|"+message.location.room}}

                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">当前状态</div>
                  <div class="item-title dd-title">
                    {{'正常' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label"> 指标读数</div>
                  <div class="item-title dd-title">
                    <div v-for='mtr in message.monitors'  >
                    {{mtr.name+':'+ mtr.value+mtr.unit }}
                    </div>
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">更新时间</div>
                  <div class="item-title dd-title">
                    {{message._modifyTime |date('HH:mm:ss') }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">维修记录</div>
                  <a class="item-title dd-title"  @click="setTab()">

                    {{'8次' }}</a>
                </div>
              </div>
            </div>
            <div class="card-actions card-no-top-padding">
              <div class="text-line" v-for='item in message.tags'>
                {{item}}
              </div>
            </div>
            <div class="go-ticket card-actions card-no-top-padding" >
           <button class="primary clear small" @click='goTicket()' ><i class="on-left">directions</i> 我要报障</button>
            </div>
             </div>
        </div>
        <div class="card" ref="tab-2" >
          <div v-if="message">
            <div class="card-title">
              <div>{{message.name}} </div>
            </div>
            <div class="card-content list no-border highlight">
              <div class="item multiple-lines d-lines content">
                <div class="item-content row items-center">
                  <div class="item-label dd-label">生产商</div>
                  <div class="item-title dd-title">
                    {{message.location.building+"|"+message.location.floor+"|"+message.location.room}}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">设备品牌</div>
                  <div class="item-title dd-title">
                    {{'正常' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label"> 规格型号</div>
                  <div class="item-title dd-title">
                    {{' A:999 B:888 C:333' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">设备重量</div>
                  <div class="item-title dd-title">
                    {{'正常' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label"> 设计寿命</div>
                  <div class="item-title dd-title">
                    {{' A:999 B:888 C:333' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">出厂日期</div>
                  <div class="item-title dd-title">
                    {{'正常' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label"> 供应商</div>
                  <div class="item-title dd-title">
                    {{' A:999 B:888 C:333' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label"> 安装单位</div>
                  <div class="item-title dd-title">
                    {{' A:999 B:888 C:333' }}
                  </div>
                </div>
                <div class="item-content row items-center">
                  <div class="item-label dd-label">安装时间</div>
                  <div class="item-title dd-title">
                    {{message._modifyTime |date('HH:mm:ss') }}
                  </div>
                </div>
              </div>
            </div>
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
    <div class="row justify-center" style="margin-bottom: 50px;">
        <err v-if="getErrFlag"/>
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
     ...mapGetters(['getGlbErr']),
      getErrFlag(){
        return this.getGlbErr.isFlag
      },
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
      getRcd(){
        console.log('-rrr--id::::', this.message.tenantId )

      },
      getMft(){
        console.log('---id::::', this.message.manufacturerId )
      },
      goTicket(){
      },
      setTab(){
        this.tabNo='tab-3'
        console.log(this.setActiveTab)

      },
      getMessage() {
        let _self = this
        const id = _self.$route.params.id
        _self.findMessages(id)
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
 .dd-label{
  flex: 1;
}
.dd-title{
  flex:2;
  font-size: 16px;
  font-weight: 400;
}
.card-actions{
  flex-wrap: wrap;
  padding: 12px;
  justify-content: flex-start;
}
.go-ticket{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
