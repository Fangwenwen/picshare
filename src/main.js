import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from './components/toast/index'
import Loading from './components/loading/index'
import googleLogin from './directive/google-login'
import facebookLogin from './directive/facebook-login'
import facebookShare from './directive/facebook-share'
import { BetterScroll } from 'cube-ui'

import './common/css/index.scss'

Vue.prototype.$toast = Toast.install // 注册全局提示组件
Vue.use(Loading) // 注册全局加载组件

// Vue.use(BetterScroll)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
