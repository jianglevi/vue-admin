<template>
  <div id="nav-wrap">
    <h1>
      <img src="@/svg/logo.jpeg" alt />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      router
    >
      <template v-for="(item,i) in routers">
        <el-submenu :key="item.id" v-if="!item.hidden" :index="i.toString()">
          <!-- 一级菜单 -->
          <template slot="title">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <!-- 子级选项 -->
          <el-menu-item
            :index="subItem.path"
            v-for="(subItem) in item.children"
            :key="subItem.id"
          >{{subItem.meta.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
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
  name: "navMenu",
  setup(props, { root }) {
    // data数据
    // 路由数组
    const routers = reactive(root.$router.options.routes);
    console.log(routers);
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    // computed监听
    const isCollapse = computed(() => root.$store.state.app.isCollapse);
    return {
      isCollapse,
      handleOpen,
      handleClose,
      routers
    };
  }
};
</script>

<style scoped lang='less'>
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #000;
  transition: all 0.3s ease 0s;
}
h1 {
  margin: 10px auto;
  width: 100px;
  img {
    width: 100%;
  }
}
/* 导航菜单的选项 */
.el-menu {
  border: none;
}
.el-menu-item {
  font-size: 14px;
  padding-left: 50px !important;
}
.el-submenu .is-active {
  background-color: lightblue !important;
}

.el-submenu
      .is-opened
      .el-submenu_title{
        background-color: green !important;
      }
    
.open {
  #nav-wrap {
    width: 250px;
  }
}
.close {
  #nav-wrap {
    width: 70px;
    h1 {
      width: 60px;
    }
  }
  
}
</style>