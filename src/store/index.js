import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    menuRouterList: []
  },
  getters: {
    getMenuRouter(state) {
      return state.menuRouterList
    }
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id
      window.sessionStorage.setItem('userid', id)
    },
    getUserId(state) {
      state.userId = window.sessionStorage.getItem('userid')
    },
    setRouter(state, routerList) {
      state.menuRouterList = routerList
      window.sessionStorage.setItem('routerList', JSON.stringify(routerList))
    },
    getMenuRouterList(state) {
      state.menuRouterList = JSON.parse(window.sessionStorage.getItem('routerList'))
    }
  },
  actions: {
  },
  modules: {
  }
})
