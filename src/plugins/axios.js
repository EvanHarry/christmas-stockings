import Vue from 'vue'

import axios from 'axios'

// Axios plugin
const dev = 'http://localhost:5000'
const production = 'https://evanharry.pythonanywhere.com'
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? dev : production

let axiosPlugin = {}
axiosPlugin.install = (Vue, options) => {
  Vue.prototype.$axios = axios
}

Vue.use(axiosPlugin)
