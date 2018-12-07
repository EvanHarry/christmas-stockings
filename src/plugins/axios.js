import Vue from 'vue'

import axios from 'axios'

// Axios plugin
const dev = ''
const production = ''
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? dev : production

let axiosPlugin = {}
axiosPlugin.install = (Vue, options) => {
  Vue.prototype.$axios = axios
}

Vue.use(axiosPlugin)
