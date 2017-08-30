<template>
  <div class="layout-view">
  <div class="layout-padding">
    <div class="row gutter wrap justify-stretch content-center text-center">
      <div class="auto">
        <q-select class=" list-btn" type="list" v-model="selectType" :options="items_type"></q-select>
      </div>
      <div class="auto">
        <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
      </div>
    </div>
    <q-infinite-scroll :handler="refresher">
      <div class="list item-inset-delimiter" v-if="message.length"  >
        <div class="item item-link" v-for="(item,index) in message " @click="getDetail(item.id)">
          <i class="item-primary">mail</i>
          <div class="item-content inset">
            {{item.ticketId}}
            {{item.system}}
            {{item.state.time}}
          </div>
          <i class="item-secondary">keyboard_arrow_right</i>
        </div>
      </div>
      <div class="row justify-center" style="margin-bottom: 50px;">
        <spinner name="dots" slot="message" :size="40" v-if="fetched">
        </spinner>
        <div slot="message" :size="40" v-else>
          {{tips}}
        </div>
      </div>
    </q-infinite-scroll>
    <button class="absolute-bottom-right circular teal" style="right: 18px; bottom: 18px;" @click="add()"><i class="q-fab-icon">add</i>
      </button>
  </div>
  </div>
</template>
<script>
  import toolbar from 'components/layout/toolbar.vue'
  import {
    mapGetters,
    mapMutations,
    mapState,
    mapActions
  } from 'vuex'
  import { Toast }
from 'quasar'
  export default {
    data() {
      return {
        tips: '',
        fetched:true,
        searchModel: '',
        limit: 10,
        skip: 10,
        selectType: 'NONE',
        selectTime: 'NOW',
        items_time: [{
          value: 'NOW',
          label: '今日'
        },{
          value: 'WEEK',
          label: '本周'
        },{
          value: 'ALL',
          label: '所有'
        }],
        items_type: [{
          value: 'FINISHED',
          label: '已处理'
        }, {
          value: 'NONE',
          label: '未处理'
        }, {
          value: 'PENDING',
          label: '处理中'
        }]
      }
    },
    computed: {
      ...mapGetters('message', {
        message: 'list',
      })
    },
    components: {
      toolbar
    },
    created() {
      this.findMessages({
        query: {
          $limit: this.limit
        }
      })
      .catch(err=>{
          this.fetched=false
          this.tips = '哦,服务开小差了'
        Toast.create.warning({html:'服务崩溃，稍后再试',timeout:500})
      })
    },
    mounted() {
      this.setNavInfo()
    },
    methods: {
      refresher(index, done) {
        let _self=this
        setTimeout(() => {
          if(_self.fetched){
              let items =[]
              _self.findMessages({
                query: {
                  $limit: 10,
                  $skip: _self.skip
                }
              }).then((res)=>{
                items=res.data
                if(items.length==0){
                    _self.fetched=false
                  _self.tips='加载完成.'
                }else{
                  _self.message = _self.message.concat(items)
                  _self.skip += 10;
                }
                console.log('-=',   _self.fetched)
              })
              done()
          }
        }, 2500)
      },
      ...mapMutations(['setNav']),
      setNavInfo() {
        this.setNav({
          title: '报障清单',
          search: true,
          show: {
            bar: true
          },
          direction: 'true'
        })
      },
      getMessages() {
        this.clear()
        let q = {}
        if (this.searchModel) {
          q.query = {
            $or: [
              {  system: this.searchModel },
              {  ticketId: this.searchModel }
            ]
          }
        }
        this.findMessages(q)
      },
      ...mapMutations('message', {
        clear: 'clearAll'
      }),
      ...mapActions('message', {
        findMessages: 'find',
      }),
      add() {
        this.$router.push({
          path: '/device/new'
        })
      },
      getDetail(id) {
        this.$router.push({
          path: '/device/' + id
        })
      }
    }
  }

  /*
  import io from 'socket.io-client'
  const socket=io('http://192.168.123.125:3030')
  socket.emit('message::find', { status: 'read', user: 10 }, (error, data) => {
    console.log('Found all messages', data);
  });*/

</script>
<style>
  .list-btn {
    width: 100%;
  }

</style>
