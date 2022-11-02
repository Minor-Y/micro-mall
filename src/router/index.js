import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import store from '../store/index'
import _ from 'lodash'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 固定路由
const constantRouterMap = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: { index: 0 },
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: { index: 0 },
    redirect: '/dashboardover',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "home" */ '../components/404.vue'),
  },
]

// 注册路由
const router = new VueRouter({
  routes: constantRouterMap
})

// 处理路由，生成路由格式数组
const disposeRouter = (perss) => {
  const routerList = []
  if (perss) {
    perss.forEach((menu) => {
      if (menu.childs) {
        if (menu.component !== 'Layout') {
          let mList = {
            path: menu.path,
            name: menu.path.split('/')[1],
            meta: { id: menu.id },
            component: resolve => require([`@/views/${menu.component}.vue`], resolve)
          }
          routerList.push(mList)
        } else {
          menu.childs.forEach(item => {
            let rList = {
              path: item.path,
              name: item.path.split('/')[1],
              meta: { id: item.id },
              component: resolve => require([`@/views/${item.component}.vue`], resolve)
            }
            routerList.push(rList)
          })
        }

      }
    })
  }
  return routerList
}

const error404 = { path: "*", redirect: "/404", hidden: true };

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // 获取token
  let token = window.sessionStorage.getItem('token')
  const tokenStart = window.sessionStorage.getItem('tokenStart')
  const nowDate = new Date().getTime()
  const timeOver = 3600 * 24 * 1000
  if (nowDate - tokenStart > timeOver) { // 判断token是否过期
    token = null
  }
  if (token) { // 判断token是否存在
    if (to.path === '/login') {
      next('/home')
    } else {
      if (router.getRoutes().length === 4) { // 判断动态路由是否添加成功，未添加成功是只有无需权限的4个基本路由
        try {
          store.commit('getMenuRouterList') // 保证vuex里有路由数据
          const permiss = _.cloneDeep(store.state.menuRouterList)
          const routerLists = disposeRouter(permiss) // 处理生成路由格式的路由数组
          routerLists.forEach((item) => {
            router.addRoute('home', item)
          })
          router.addRoute(error404) // 在最后插入404路由
          next({ ...to, replace: true })
        } catch (err) {
          console.log(err)
        }
      } else {
        next()
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      Message.error('登录状态过期，请重新登录')
      window.sessionStorage.clear()
      next('/login')
    }
  }
})

export default router
