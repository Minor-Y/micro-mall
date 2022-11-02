import App from './App.vue'
import * as filters from './filters/index'

import '../src/assets/css/global.css'
import router from './router'
import store from './store'

//全局挂载axios
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

// 通过循环，将过滤器文件内所有方法注入 main.js 内
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 设置axios请求拦截器 interceptors拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token') // 为每次的axios请求响应头添加Authorization的token信息
  return config
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
