// 检测权限点工具

export function checkAuthority(permissionCode, permissions) {
  let hasPermission = true
  if (permissionCode) {
    if (permissionCode instanceof Array && permissionCode.length > 0) {
      hasPermission = permissions.some(item => permissionCode.includes(item))
    } else {
      hasPermission = permissions.some(item => item === permissionCode)
    }
  }
  return hasPermission
}
