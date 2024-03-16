import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'

import request from '@/utils/request'
import storage from '@/utils/storage'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.$storeage = storage

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
