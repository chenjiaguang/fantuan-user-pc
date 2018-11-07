import axios from 'axios'
import toast from '../components/toast'

// config自定义参数:
// dontToast:bool:不显示默认的错误toast
// checkLogin:bool:检查登录
axios.defaults.method = 'post'
axios.interceptors.request.use(function (config) {
  if (config.method.toUpperCase() === 'GET') {
    axios.defaults.method = 'get'
  }
  if (!config.data) config.data = {}
  // 在发送请求之前做些什么
  // window.localStorage.token = 'c46bb5b5d0f54013bcdf75a6ebf967b1'
  if (config.data instanceof FormData) {
    config.data.append('token', config.data.token || window.sessionStorage.token || '')
  } else if (typeof (config.data) === 'string') {
    config.data += '&token=' + (config.data.token || window.sessionStorage.token || '')
  } else {
    config.data = JSON.parse(JSON.stringify(config.data))
    config.data.token = config.data.token || window.sessionStorage.token || ''
    // config.data.token = '9126bd1bab364d7399261c2757e35b22'
    config.data.origin = 'H5'
  }
  if (config.token || config.data.token) { // 如果传入了token，将token放入headers中
    config.headers.token = config.token || config.data.token
  }
  if (config.contentType) {
    config.headers['Content-Type'] = config.contentType
  }
  config.headers['version'] = '2.5.1'
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  if (res.data.msg && res.data.error !== 0 && res.data.error !== '0') {
    if (res.config.dontToast !== true) {
      toast(res.data.msg, 2000, () => { })
    }
    return Promise.reject(res)
  }

  // 如果用于下载文件时，返回整个对象，否则直接返回对象的数据部分
  if (res.config.responseType === 'blob') {
    return res
  } else {
    return res.data
  }
}, function (error) {
  // 对响应错误做点什么
  if (error.message) {
    toast('网络异常，请检查网络设置', 2000, () => { })
  }
  return Promise.reject(error)
})

export default axios
