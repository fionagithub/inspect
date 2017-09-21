<template>
  <q-layout>
    <div slot="header" class="toolbar">
        <button class="head_goback" @click="$router.go(-1)">
          <i>arrow_back</i>
        </button> 
        <q-toolbar-title :padding="1">
          反馈 
        </q-toolbar-title>
      </div>
    <div class="layout-view" >
      <div class="layout-padding ">
        <div class="item multiple-lines">
          <div class="item-content">
            <div class="item-label">我要反馈:</div>
            <textarea class="full-width new-desc"> </textarea>
          </div>
        </div>
        <!--<pre>$v: {{ $v }}</pre>-->
        <div class="add-btn">
          <button class="teal full-width" disabled>提交</button>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>


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
</style>
