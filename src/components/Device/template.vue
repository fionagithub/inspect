<template>
    <div class="layout-view">
      <div class="row gutter wrap justify-stretch content-center text-center">
        <div class="auto">
          <q-select class=" list-btn" type="list" v-model="selectType" :options="items_type"></q-select>
        </div>
        <div class="auto">
          <q-select class=" list-btn" type="list" v-model="selectTime" :options="items_time"></q-select>
        </div>
      </div>

      <q-infinite-scroll :handler="refresher">
        <div class="list item-inset-delimiter">
          <div class="item item-link" v-for="(item,index) in message " @click="getDetail(item.id)">
            <i class="item-primary">mail</i>
            <div class="item-content inset">
              {{item.deviceName}}
            </div>
            <i class="item-secondary">keyboard_arrow_right</i>
          </div>
        </div>
        <div class="row justify-center" style="margin-bottom: 50px;">
          <spinner name="dots" slot="message" :size="40"></spinner>
        </div>
      </q-infinite-scroll>
      <button class="absolute-bottom-right circular teal" style="right: 18px; bottom: 18px;" @click="add()"><i class="q-fab-icon">add</i>
      </button>
    </div>
</template>
<script>
  import toolbar from 'components/layout/toolbar.vue'
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'

  export default {
    data() {
      return {
        searchModel: '',
        limit:10,
        skip:10,
        selectType: 'FINISHED',
        selectTime: 'AM',
        items_time: [{
          value: 'AM',
          label: '上午'
        }],
        items_type: [{
          value: 'FINISHED',
          label: '已派'
        },{
          value: 'PENDING',
          label: '未派'
        },{
          value: 'DONE',
          label: '完成'
        }]
      }
    },
    computed: {
      ...mapGetters('message', {
        message: 'list',
      }), 
    },
    components: {
      toolbar
    },
    created() {
      this.findMessages({
        query:{
    $limit: this.limit
        }
      })
    },
    mounted(){
      this.setBarInfo()

    },
    methods: {
       refresher (index, done) {
      setTimeout(() => {
        let items = []
      this.findMessages({
        query:{
    $limit: 10,
    $skip: this.skip
        }
      })
        this.message = this.message.concat(items)
        this.skip+=10;
        done()
      }, 2500)
    },
      ...mapMutations(['setBar'] ),
      setBarInfo(){
        this.setBar({
          title:'报障',
          search:true,
          show: {
            bar:true,
            drawer:false,
          },
          direction:'true'
        })
      },
      getMessages() {
        this.clear()
        let q={}
        if(this.searchModel){
          q.query= {
            deviceName: this.searchModel
          }
        }
        this.findMessages(q) 
      },
      add() {
        this.$router.push({
          path: '/device/new'
        })
      },
      ...mapMutations('message', {
        clear: 'clearAll'
      }),
      ...mapActions('message', {
        findMessages: 'find',
      }),
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
