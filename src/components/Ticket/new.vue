<template>
  <div class="layout-view ">
    <div class="layout-padding ">
      <div class="item two-lines">
        <div class="item-content row items-center wrap">
          <div class="item-label">系统:</div>
          <q-select class="full-width" type="list" v-model="system" :options="selectsystem"></q-select>
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
        </div>
      </div>
      <!--<pre>$v: {{ $v }}</pre>-->
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
  import toolbar from 'components/layout/toolbar.vue'
  import {
    mapMutations,
    mapActions,
    mapGetters
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  import {_new} from './data'
  export default {
    name: "new",
    data() {
      let _dt = {
        stateTime: moment().format()
      }
      return Object.assign(_dt, _new)
    },
    created() {
      this.setNavInfo()
    },
    mounted(){
     // this.getSystem()
    },
    methods: { 
      ...mapMutations('tickets', {
        clear: 'clearAll'
      }),
      ...mapActions('mate', {
        GetSystemItems: 'find',
      }),
      getSystem(){
        let _query={query:{ 'type': 'system'} }
        this.GetSystemItems(_query ).then(res =>{
          console.log(res)
        } )
      },
      ...mapActions('tickets', {
        createMessages: 'create',
      }),
      ...mapMutations(['setNav']),
      setNavInfo() {
        this.setNav({
          popover: '开发中',
          title: '新增报障',
          show: {
            bar: true,
          },
          direction: true
        })
      },
      add() {
        let data = {
          "priority": parseInt(this.priority),
          "system": this.system,
          "stateTime": this.stateTime,
          "description": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            this.$router.push('/ticket')
            // console.log('-=-=', res)
          })
          .catch(error => {
            Toast.create.negative({
              html: '出错了.',
              timeout: 500
            })
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            console.log('-=:[]', error)
          })
      }
    },
    plugins: ['vuelidate'],
    components: {
      toolbar
    },
    destroyed: function () {
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

  .form-group__message {
    display: none;
    font-size: .95rem;
    color: #CC3333;
    margin-left: 10em;
    margin-bottom: 12px;
  }

  .form-group--error+.form-group__message {
    display: block;
    color: #CC3333;
  }
.n-rating{
  font-size: 2rem;
  margin: 0 10px;
}
</style>
