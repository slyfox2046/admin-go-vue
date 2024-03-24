//获取权限配置

import {checkAuthority} from '@/utils/authority'
import storage from '@/utils/storage'

export default {
  inserted(el, binding) {
    const { value } = binding
    const permissions = storage.getItem('permissionList') || []
    const hasPermissions = checkAuthority(value, permissions)
    if (!hasPermissions) {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      } else {
        el.innerHtml = ""
      }
    } else {
      el&&el.setAttribute('code',value)
    }
  }
}
