<template>
    <div class="layout-view" >
      <div class="layout-padding ">
        <err v-if="getErrFlag"/>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">系统:</div>
            <q-select class="full-width" type="list" v-model="system" :options="systemItems"></q-select>
          </div>
        </div>
        <div class="item">
          <div class="item-content row items-center wrap">
            <div class="item-label">优先级:</div>
            <q-rating class="orange n-rating " v-model="priority" :max="priorityMax"></q-rating>
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">报障时间:</div>
            <q-datetime class="full-width red" v-model="stateTime" type="datetime" :ok-label='okLabel' :cancel-label='cclLabel' :clear-label='clrLabel'></q-datetime>
          </div>
        </div>
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">报障描述:</div>
            <textarea class="full-width new-desc" v-model="description"> </textarea>
            <div class="form-group--error" v-if="!$v.description.minLength">至少{{ $v.description.$params.minLength.min }}位...</div>
          </div>
        </div>
      <!--  <pre>$v: {{ $v.description }}</pre>-->
        <div class="add-btn">
          <button class="teal full-width" @click="add()" :disabled="$v.$dirty==$v.$invalid==false">提交</button>
        </div>
      </div>
    </div>
</template>
<script>
  import moment from 'moment'
  import {
    required,
    sameAs,
    between,
    minLength
  } from 'vuelidate/lib/validators'
  import {
    mapMutations,
    mapActions,
    mapGetters,
    mapState
  } from 'vuex'
  import popover from '../layout/popover'
 import {
    Toast
  } from 'quasar'
  import {_new} from './data'
  export default {
    name: "new",
    data() {
      let _dt = {
        stateTime: moment().format(),
      }
      return Object.assign(_dt, _new)
    },
    created() {
      this.setError()
    },
    mounted(){
    },
    computed:{
      ...mapState(['systemItems','priorityMax', 'stateItems']),
      ...mapGetters(['getGlbErr']),
      getErrFlag(){
        return this.getGlbErr.isFlag
      },
    },
    methods: { 
      ...mapMutations(['setError']),
      ...mapMutations('tickets', {
        clear: 'clearCurrent'
      }),
      ...mapActions('tickets', {
        createMessages: 'create',
      }),
      add() {
        let data = {
          "priority": parseInt(this.priority),
          "system": this.system,
          "reportTime": this.stateTime,
          "description": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            this.$router.go(-1)
            // console.log('-=-=', res)
          })
      }
    },
    plugins: ['vuelidate'],
    components: {
      popover
    },
    destroyed: function () {
      this.setError()
      this.clear() // 置空ticket-vuex      
      console.log("已销毁");
    },
    validations: {
      description: {
        required,
        minLength: minLength(4)
      }
    }
  }

</script>
<style>
  .add-btn {
    margin-top: 50px;
  }

  .new-desc {
    height: 80px;
  }

</style>
