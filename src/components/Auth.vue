<template>
  <div class="error-page window-height window-width bg-light column items-center">
    <div class="error-code teal flex items-center justify-center">
      <div class="error-card card bg-white column items-center justify-center">
       <spinner color="#2296a5"  name="bars" :size="30"></spinner>
        <p class="text-center group">
          <h5>
            认证中...
          </h5>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
 .error-code{
    height :50vh;
    width :100%;
    padding-top: 15vh;
    font-size :30vmax;
    color :rgba(255, 255, 255, .2);
    overflow :hidden;
  }
  .error-card{
    margin-top: -25px;
    width: 90vw;
    max-width :600px;
    padding :50px;
  }
    h5{
      color: black;
    }
</style>
