import axios from 'axios'
import router from '../router'
import Vue from 'vue'

// 基础地址
const baseURL = 'https://LUCKYCJ.XYZ'
// const baseURL = 'http://172.16.77.17:8000'

// 设置默认的基础地址
axios.defaults.baseURL = baseURL

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // console.log(config)
  Vue.$loading.show()
  if (localStorage.getItem('token')) {
    config.headers.Authorization = `JWT ${localStorage.getItem('token')}` // 给请求头添加 token
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// 添加响应拦截器
axios.interceptors.response.use((res) => {
  Vue.$loading.hide()
  return res.data
}, (err) => {
  Vue.$loading.hide()
  if (err.response) {
    switch (err.response.status) {
      case 401: // 返回 401 清除token信息、user信息并跳转到登录页面
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
    }
  }
  return Promise.reject(err.response)
})

export default axios
