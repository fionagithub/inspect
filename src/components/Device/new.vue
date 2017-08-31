<template>
  <div class="layout-view ">
    <div class="layout-padding ">
      <div class="item two-lines">
        <div class="item-content row items-center wrap">
          <div class="item-label">系统:</div>
          <q-select class="full-width" type="list" v-model="system" :options="selectsystem"></q-select>
        </div>
      </div> 
      <div class="item two-lines">
        <div class="item-content row items-center wrap">
          <div class="item-label">优先级:</div>
          <q-select class="full-width" type="radio" v-model="priority" :options="selectPriority"></q-select>
        </div>
      </div>
      <div class="item two-lines">
        <div class="item-content row items-center wrap">
          <div class="item-label">工单状态:</div>
          <q-select class="full-width" type="list" v-model="stateName" :options="selectstateName"></q-select>
        </div>
      </div>
      <div class="item multiple-lines">
        <div class="item-content row items-center wrap">
          <div class="item-label">报障时间:</div>
          <q-datetime class="full-width" v-model="stateTime" type="datetime"></q-datetime>
        </div>
      </div>
      <div class="item multiple-lines">
        <div class="item-content">
          <div class="item-label">报障描述:</div>
          <textarea class="full-width" v-model="description"> </textarea>
        </div>
      </div>
      <!--<pre>$v: {{ $v }}</pre>-->
      <div class="add-btn">
        <button class="teal full-width" @click="add()" :disabled="$v.$dirty&&$v.$error">提交</button>
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
    mapActions,
    mapMutations
  } from 'vuex'
  import {
    Toast
  } from 'quasar'
  import _data from './data'
  export default {
    name: "new",
    data() {
      let _stateTime={ stateTime:  moment().format()}
     return Object.assign(_stateTime,_data)
    },
    created() {
      this.setNavInfo()
    },
    methods: {
      ...mapActions('tickets', {
        createMessages: 'create',
      }),
      ...mapMutations(['setNav']),
      setNavInfo() {
        this.setNav({
          title: '新增报障',
          show: {
            bar: true,
          },
          direction: true
        })
      },
      add() {
        let data = {
          "state": this.stateName,
          "priority":parseInt(this.priority),
          "system":this.system,
          "stateTime": this.stateTime,
          "description": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            // console.log('-=-=', res)
          })
          .catch(error => {
            Toast.create.negative({html:'出错了.',timeout:500})
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
    validations: {
      description: {
        required,
        minLength: minLength(2)
      },
      stateName: {
        required,
        minLength: minLength(2)
      }
    }
  }

</script>
<style>
  .add-btn {
    margin-top: 50px;
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

</style>
