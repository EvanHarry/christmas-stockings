import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    user: null
  },
  getters: {
    loggedIn (state) {
      return !!state.user
    }
  },
  mutations: {
    login (state, user) {
      state.user = user
    },
    logout (state) {
      state.user = null
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
        const { data } = await axios.post('/token', { username, password })
        const user = decode(data.token)

        localStorage.setItem('token', data.token)
        commit('login', user)
        commit('stopLoading')
      } catch (e) {
        commit('stopLoading')

        if (e.response) {
          let error = ''

          switch (e.response.status) {
            case 401:
              error = 'Bad credentials'
              break

            case 404:
              error = 'User not found'
              break

            default:
              break
          }

          throw new Error(error)
        }
      }
    }
  }
})
