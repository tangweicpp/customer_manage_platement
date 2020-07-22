// 引入
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import Home from '../components/home/Home.vue'
import Login from '../components/login/Login.vue'
import Users from '../components/users/Users.vue'
import Po_uploads from '../components/po_uploads/Po_uploads.vue'
import Po_keyin from '../components/po_keyin/Po_keyin.vue'
import Po_view from '../components/po_view/Po_view.vue'

// 在模块化工程中use
Vue.use(VueRouter)

// 实例化
const router = new VueRouter(
  {
    routes: [
      { path: "/", redirect: "/login" },
      { path: "/login", name: "login", component: Login },
      { path: "/users", name: "users", component: Users },
      {
        path: "/home", name: "home", component: Home, children: [
          { path: "/po_uploads", name: "po_uploads", component: Po_uploads },
          { path: "/po_keyin", name: "po_keyin", component: Po_keyin },
          { path: "/po_view", name: "po_view", component: Po_view },
        ]
      },
    ]
  }
)

// 导出
export default router