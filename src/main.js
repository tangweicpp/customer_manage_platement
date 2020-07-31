// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入自定义的全局css
import './assets/css/common.css'
// 全局引入axios
import axios from 'axios'
// 全局引入qs
import qs from 'qs'
// 防止多次点击,重复提交
import preventReClick from './store/preventReClick'
// 引入路由 进行挂载
import router from './router/router.js'
// 引入全局api
import Api from "./interface/index"

Vue.prototype.$Api = Api;

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  Api,
  components: { App },
  template: '<App/>'
})
