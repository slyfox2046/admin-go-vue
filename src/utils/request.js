import router from '@/router/router'
import axios from 'axios'
import { Message } from 'element-ui'
// 创建axios对象，添加全局配置
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 8000,
})

// 请求拦截
service.interceptors.request.use(req => {
  const headers = req.headers
  if (!headers.Authorization) {
    headers.Authorization = 'Bearer ' + 'admin'
  }
  return req
})

// 响应拦截
service.interceptors.response.use(res => {
  const { code, data, message } = res.data
  if (code === 403) {
    Message.error(message)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else if (code === 406) {
    Message.error(message)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else {
    return res;
  }
})
// 请求核心函数
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  service.default.baseURL = process.env.VUE_APP_BASE_API
  return service(options)
}

export default request
