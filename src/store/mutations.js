import storage from '@/utils/storage'

export default {
  saveSysAdmin(state, sysAdmin) {
    state.sysAdmin = sysAdmin
    storage.setItem('sysAdmin', sysAdmin)
  },
  saveToken(state, token) {
    state.token = token
    storage.setItem('token', token)
  },
  saveLeftMenuList(state, leftMenuList) {
    state.leftMenuList = leftMenuList
    storage.setItem('leftMenuList', leftMenuList)
  },
  savePermissionList(state, permissionList) {
    state.permissionList = permissionList
    storage.setItem('permissionList', permissionList)
  },
}
