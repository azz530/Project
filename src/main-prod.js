
import App from './App.vue'
import requests from './api/request'
import router from './router'
import store from './store'
import './style/global.css'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import echartsTool from './tool/echartsTool.js'
import tools from './tool/tools'
import './components/index' //全局组件

Vue.prototype.$http = requests;
Vue.prototype.$EchartsOption = echartsTool;
Vue.config.productionTip = false
Vue.prototype.$Tools = tools;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
