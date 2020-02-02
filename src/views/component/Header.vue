<template>
  <div id="header-wrap">
    <div class="pull-left header-icon">
      <img src="@/svg/menu.svg" alt @click="isCollapseEvent" />
    </div>
    <div class="pull-right header-icon">
      管理员: {{username}}
      <img class="avatar" src="@/svg/avatar.jpeg" alt />

      <img class src="@/svg/switch.svg"  @click="exit" />
    </div>
    
  </div> 
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  onMounted,
  computed
} from "@vue/composition-api";
export default {
  name: "header",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.app.username);
    const isCollapseEvent = () => {
      root.$store.commit("handleIsCollapse");
    };
    // 退出
    const exit = () => {
      root.$confirm('确认退出账号？').then(()=>{
        root.$store.dispatch("app/Exit").then(() => {
        root.$router.push("/login") })
      })
      
    }
    
    return {
      isCollapseEvent,
      username,
      exit,
    };
  }
};
</script>

<style scoped lang="less">
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  height: 75px;
  background-color: #fff;
  box-shadow: none;
  line-height: 75px;
  transition: all 0.3s;
}
.header-icon {
  padding: 0 32px;
  img {
    height: 25px;
    cursor: pointer;
    margin-bottom: -6px;
  }
  .avatar {
    height: 30px;
    margin-left: 5px;
    border-radius: 50%;
    margin-right: 20px;
    margin-bottom: -10px;
    border: 1px solid #e3e3e3;
    box-shadow: 0 0 1px;
  }
}
.open {
  #header-wrap {
    left: 250px;
  }
}
.close {
  #header-wrap {
    left: 100px;
  }

}
.dialog{
    
}
</style>