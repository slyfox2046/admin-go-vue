import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'

import store from '@/store'
import request from '@/utils/request'
import storage from '@/utils/storage'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from './api'
import './assets/css/global.css'

Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.$storage = storage
Vue.prototype.$api = api

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
