import router from '@/router/router'
import storage from '@/utils/storage'
import axios from 'axios'
import { Message } from 'element-ui'
// 创建axios对象，添加全局配置
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 8000,
})
// console.log(process)

// 请求拦截
service.interceptors.request.use(req => {
  const headers = req.headers
  const token = storage.getItem('token') || {}
  if (!headers.Authorization) {
    headers.Authorization = 'Bearer ' + token
  }
  return req
})

// 响应拦截
service.interceptors.response.use(res => {
  const { code, data, message } = res.data
  console.log(data)
  if (code !== 200) {
    Message({
      message: message || "Error",
      type: "error",
      duration: 5 * 1000
    });
    if (code === 403) {
      Message.error(message)
      setTimeout(() => {
        // 请求头中的auth为空
        storage.clearAll()
        router.push('/login')
      }, 1500)
    } else if (code === 406) {
      // 无效的token，请重新登录
      Message.error(message)
      setTimeout(() => {
        storage.clearAll()
        router.push('/login')
      }, 1500)
    }
    // Message.error(message)
    return Promise.reject(new Error(message||"Error"))
  } else {
    return res
  }
},error => {
  console.log("err" + error); // for debug
  Message({
    message: error.message,
    type: "error",
    duration: 5 * 1000
  });
  return Promise.reject(error);
}
)
// 请求核心函数
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  console.log(process.env.VUE_APP_BASE_API)
  service.defaults.baseURL = process.env.VUE_APP_BASE_API
  return service(options)
}

export default request
