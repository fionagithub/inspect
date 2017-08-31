<template>
  <div class="layout-view">
    <div class="layout-padding">
      <div class="row gutter wrap justify-stretch content-center text-center">
        <q-search class="full-width" v-model="searchModel" @enter='getMessages()'></q-search>
        <div class="auto">
          <q-select class=" list-btn" type="list" v-model="selectType" :options="items_type"></q-select>
        </div>
        <div class="auto">
          <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
        </div>
      </div>
      <q-infinite-scroll :handler="refresher">
        <div class="list item-inset-delimiter" v-if="message.length">
          <div class="item item-link" v-for="(item,index) in message " @click="getDetail(item.ticketId)">
            <i class="item-primary">mail</i>
            <div class="item-content inset">
              {{item.ticketId}} {{item.system}} {{item.state.time}}
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
  import {
    Toast
  }
  from 'quasar'
  export default {
    data() {
      return {
        tips: '',
        message:[],
        fetched: true,
        searchModel: '',
        limit: 10,
        skip: 0,
        selectType: 'NONE',
        selectTime: 'NOW',
        items_time: [{
          value: 'NOW',
          label: '今日'
        }, {
          value: 'WEEK',
          label: '本周'
        }, {
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
     /* ...mapGetters('tickets', {
        message: 'list',
      })*/
    },
    components: {
      toolbar
    },
    created() {
      this.findMessages()
        .catch(err => {
          this.fetched = false
          this.tips = '哦,服务开小差了'
          Toast.create.negative({
            html: '服务崩溃，稍后再试',
            timeout: 500
          })
        })
    },
    mounted() {
      this.setNavInfo()
    },
    methods: {
      ...mapMutations('tickets', {
        clear: 'clearAll'
      }),
      ...mapActions('tickets', {
        findMessages: 'find',
      }),
      refresher(index, done) {
        let _self = this
        // setTimeout(() => {
          if (_self.fetched) {
            let _query = { 
                $limit: 10,
                $skip: _self.skip,
             
            }
            if( _self.searchModel !=='' ){
            _query=  Object.assign(_query ,{     '$or': [{
                    ticketId: _self.searchModel
                  }] } )

            }
            _self.findMessages({query: _query}).then((res) => {
              if (res.data.length == 0) {
                console.log('-=1-')
                _self.tips = '已加载全部数据.'
                _self.fetched = false
            if( _self.searchModel !=='' ){
                _self.tips = '暂无数据.'
              }
              } else {
                console.log('-=2-')
                _self.skip += 10;
              }
                _self.message = _self.message.concat(res.data)
              console.log('-=', _self.message.length,  _self.fetched)
            })
             done()
          }
        // }, 2500)
      },
      getMessages() {
        this.skip = 0
        this.clear()
        this.message = []  
        this.refresher({},function(){})
/*        this.fetched=false
        let _query ={} 
        if (this.searchModel) {
        _query['query'] ={
          '$or': [{
          ticketId: this.searchModel
        }]
      }
      }

      this.findMessages(_query).then((res) => {
        if (res.data.length == 0) {
          console.log('-=1-')
          this.tips = '暂无数据.'
        }
          this.message = res.data
      })*/
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
