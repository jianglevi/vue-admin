import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=> import( '../views/login/Index.vue')
const Layout = ()=> import('../views/console/Console.vue')
const Index = ()=> import('../views/layout/Index.vue')

Vue.use(VueRouter)

const routes = [
  // 初始页面
  {
    path: '/', redirect:'/console',meta:{name:'主页'},hidden:true,
  }, 
  // 登录页面
  {
    path: '/login',   component: Login, meta:{name:'登录'},hidden:true,
  },
  // 控制台页面
  {
    path: '/console',   component: Layout,  redirect:'/index',meta:{name:'控制台',icon:'el-icon-s-help'},hidden:false,
    children:[
      {
        path:'/index', component:Index,meta:{name:'主页'}
      }
    ]
  },
  // 信息管理
  {
    path: '/info',   component: Layout,  
    name:"info",meta:{name:'信息管理',icon:'el-icon-s-comment'},hidden:false,
    children:[
      {
        path:'/infoIndex', component:()=>import('../views/info/infoIndex.vue'),
        meta:{name:'信息列表'}
      },
      {
        path:'/infoCategory', component:()=>import('../views/info/infoCategory.vue'),
        meta:{name:'信息分类'}
      },
    ]
  },
  // 用户管理
  {
    path: '/user',   component: Layout,
    name:'user',meta:{name:'用户管理',icon:'el-icon-s-custom'},hidden:false,
    children:[
      {
        path:'/userIndex', component:()=>import('../views/user/userIndex'),
        meta:{name:'用户列表'}
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
