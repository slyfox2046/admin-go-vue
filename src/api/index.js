import request from '@/utils/request'
export default {
  captcha() {
    return request({
      url: '/captcha',
      method: 'get',
    })
  },
  login(params) {
    return request({
      url: '/login',
      method: 'post',
      data: params,
    })
  },
}
