<template>
    <div class="layout-view ">
    <div class="layout-padding ">
      <p class="caption">例项</p>
      <div class="list">
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">工单号:</div>
            <input class="auto" v-model="ticketId" v-on:input="$v.ticketId.$touch" :class="{'has-error': $v.ticketId.$error}">
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">系统:</div>
            <q-select class="full-width" type="list" v-model="system" :options="selectsystem"></q-select>
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-content row items-center wrap">
            <div class="item-label">工单来源:</div>
            <q-select class="full-width" type="list" v-model="sourcetype" :options="selectsourcetype"></q-select>
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
            <q-select class="full-width" type="list" v-model="stateTime" :options="selectstateTime"></q-select>
          </div>
        </div>
      </div>
      <p class="caption">报障描述 </p>
      <div class="list">
        <div class="item multiple-lines item-delimiter">
          <div class="item-content">
            <!-- Notice "no-border" CSS class -->
            <input class="full-width no-border" v-model="description">
          </div>
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
  export default {
    name: "new",
    data() {
      return {
        ticketId: "",
        stateName: "",
        description: "",
        stateTime:'',
        system:'',
        sourcetype:'',
        priority:'',
        selectstateName:[{
            label: '未处理',
            value: '未处理',
          },{
            label: '处理中',
            value: '处理中',
          },{
            label: '已处理',
            value: '已处理',
          },],
        selectPriority:[{
            label: '一般',
            value: '-1',
          },{
            label: '紧急',
            value: '0',
          },{
            label: '非常紧急',
            value: '1',
          },],
          selectstateTime: [{
            label: '报告时间',
            value: '报告时间',
          },{
            label: '派工时间',
            value: '派工时间',
          },{
            label: '完成时间',
            value: '完成时间',
          },
          ],
          selectsourcetype:[{
            label: '人工填报',
            value: '人工填报',
          },{
            label: '系统上报',
            value: '系统上报',
          },],
        selectsystem: [{
            label: '弱电',
            value: '弱电',
          },
          {
            label: '强电',
            value: '强电',
          },{
            label:"保洁",
            value:'保洁'
          },{
            label:"消防",
            value:'消防'
          },{
            label:"给排水",
            value:'给排水'
          },{
            label:"其他",
            value:'其他'
          }
        ]
      }
    },
    plugins: ['vuelidate'],
    components: {
      toolbar
    },
    created(){
      this.setBarInfo()
    },
    methods:{
      ...mapMutations(['setBar'] ),
      setBarInfo(){
        this.setBar({
          title:'新增',
          search:false,
          show: {
            bar:true,
            drawer:false,
          },
          direction:'true'
        })
      },
      ...mapActions('message', {
        createMessages: 'create',
      }),
      add() {
        let data = {
          "id": this.ticketId,
          "stateName": this.stateName,
          "ticketId": this.ticketId,
          "stateTime": this.stateTime,
          "description": this.description,
        }
        this.createMessages(data)
          .then(res => {
            Toast.create('提交成功.')
            // console.log('-=-=', res)
          })
          .catch(error => {
            let type = error.errorType
            error = Object.assign({}, error)
            error.message = (type === 'uniqueViolated') ?
              'That is unavailable.' :
              'An error prevented sign.'
            this.error = error
          })
      }
    },
    validations: {
      ticketId: {
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
