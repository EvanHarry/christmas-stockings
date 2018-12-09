import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiVersion: null,
    loading: false,
    user: null
  },
  getters: {
    admin (state) {
      return state.user ? state.user.admin : false
    },
    loggedIn (state) {
      return !!state.user
    }
  },
  mutations: {
    login (state, user) {
      const token = localStorage.getItem('token')

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      state.user = user
    },
    logout (state) {
      state.user = null
    },
    setApiVersion (state, version) {
      state.apiVersion = version
    },
    startLoading (state) {
      state.loading = true
    },
    stopLoading (state) {
      state.loading = false
    }
  },
  actions: {
    async login ({ commit }, { username, password }) {
      commit('startLoading')

      try {
        const { data } = await axios.post('/auth/token/', { username, password })
        const user = decode(data.token)

        localStorage.setItem('token', data.token)

        commit('login', user)
        commit('stopLoading')
      } catch (e) {
        commit('stopLoading')

        throw e.response
      }
    },
    logout ({ commit }, router) {
      localStorage.removeItem('token')
      commit('logout')
      router.push('/login')
    }
  }
})
