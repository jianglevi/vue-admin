import Vue from 'vue'//==import Vue from "vue/dist/vue.runtime.common.js";

import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueComposition from '@vue/composition-api'

import './assets/css/main.css'
import './icon/index'
import './router/permit'


Vue.use(ElementUI)
Vue.use(VueComposition)

Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
