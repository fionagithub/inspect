<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div class="row justify-center" style="margin-bottom: 50px;" v-if="message.tips">
        {{message.tips }}
      </div>
      <div v-else>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">系统:</div>
            <input class="full-width" v-model="message.system" />
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">报障来源:</div>
            <input class="full-width" v-model="message.source.type" />
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">优先级:</div>
            <q-select class="full-width" v-model="message.priortity" :options="selectPriority"></q-select>
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">工单状态:</div>
            <input class="full-width" v-model="message.stateName" />
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">报障时间:</div>
            <input class="full-width" v-model="message.stateTime">
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">报障描述:</div>
            <textarea class="full-width" v-model="message.description"> </textarea>
          </div>
        </div>
        <!--<pre>$v: {{ $v }}</pre>-->
        <div class="add-btn">
          <button class="teal full-width" @click="add()">提交</button>
        </div>
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
        selectPriority: [{
          label: '一般',
          value: -1,
        }, {
          label: '紧急',
          value: 0,
        }, {
          label: '非常紧急',
          value: 1,
        }, ],
        message: {
          tips: '哦,服务开小差了'
        }
      }
    },
    components: {
      toolbar
    },
    created() {
      this.setNavInfo()
      this.getMessage()
    },
    methods: {
      ...mapMutations(['setNav']),
      setNavInfo() {
        let obj = {
          title: '报障详情',
          show: {
            bar: true,
          },
          direction: true
        }
        this.setNav(obj)
      },
      ...mapActions('tickets', {
        findMessages: 'find',
      }),
      getMessage() {
        let _self = this
        const id = this.$route.params.id
        this.findMessages({
            query: {
              ticketId: id
            }
          }).then(res => {
            this.message = res.data[0]
          })
          .catch(err => {
            Toast.create.negative({
              html: '服务崩溃，稍后再试',
              timeout: 500
            })
          })

      }
    },
    computed: {},
  }

</script>
<style>
  .layout-padding,
  .content {
    width: 100%;
    height: 100%;
  }

</style>
