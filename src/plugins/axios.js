import axios from 'axios'
import Vue from 'vue'

import store from '@/store'

const delay = (ms) => {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

// Axios plugin
const dev = `http://${process.env.VUE_APP_API_HOST}:5000`
const production = 'https://moki.apg-aarl.co.uk'
axios.defaults.baseURL = (process.env.NODE_ENV === 'production') ? production : dev

axios.interceptors.request.use(async (req) => {
  await delay(1000)

  return req
})

axios.interceptors.response.use((res) => {
  let version = res.headers['api-version']
  store.commit('setApiVersion', version)

  return res
}, (err) => {
  if (!err.response) {
    throw {
      response: {
        data: {
          message: 'Server offline.'
        }
      }
    }
  }

  throw err
})

let axiosPlugin = {}
axiosPlugin.install = (Vue) => {
  Vue.prototype.$axios = axios
}

Vue.use(axiosPlugin)
