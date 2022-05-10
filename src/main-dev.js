import Vue from 'vue'
import App from './App.vue'
import requests from './api/request'
import router from './router'
import store from './store'
import './plugins/element.js'
import './style/global.css'
import './assets/iconfont/iconfont.css'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import './assets/css/global.css'
import echartsTool from './tool/echartsTool.js'
import tools from './tool/tools'
import './components/index' //全局组件

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor);
Vue.prototype.$http = requests;
Vue.prototype.$EchartsOption = echartsTool;
Vue.config.productionTip = false
Vue.prototype.$Tools = tools;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
