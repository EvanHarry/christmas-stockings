import Vue from 'vue'

import axios from 'axios'

import store from '@/store'

// Axios plugin
const dev = 'http://localhost:5000'
const production = 'https://evanharry.pythonanywhere.com'
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? dev : production

axios.interceptors.response.use((res) => {
  let version = res.headers['api-version']
  store.commit('setApiVersion', version)

  return res
})

let axiosPlugin = {}
axiosPlugin.install = (Vue, options) => {
  Vue.prototype.$axios = axios
}

Vue.use(axiosPlugin)
