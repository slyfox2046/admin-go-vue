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
import handleTree from '@/utils/common'

import AuthorityDirective from '@/permission/index.js'

ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.$storage = storage
Vue.prototype.$api = api
Vue.prototype.$handleTree = handleTree

Vue.use(ElementUI).use(AuthorityDirective)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
