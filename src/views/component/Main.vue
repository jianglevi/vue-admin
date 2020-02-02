<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">abc</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  onMounted,
  computed,
  watch
} from "@vue/composition-api";
export default {
    setup(props,{root}){
    }
};
</script> 

<style scoped lang='less'>
#main-wrap {
  position: fixed;
  left: 250px;
  top: 75px;
  right: 0;
  bottom: 0;
  border: 30px solid #f7f7f7;
  border-bottom: none;
  box-sizing: border-box;
  transition: all 0.3s;
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
}

.close {
  #main-wrap {
    left: 70px;
  }
}
</style>