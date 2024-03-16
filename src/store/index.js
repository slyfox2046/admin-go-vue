import storage from '@/utils/storage'
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)

const store = new Vuex.Store({
  sysAdmin: '' || storage.getItem('sysAdmin'),
  token: '' || storage.getItem('token'),
  leftMenuList: '' || storage.getItem('leftMenuList'),
  permissionList: '' || storage.getItem('permissionList'),
  mutations,
})
export default store
