import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
import { getTokenBody, isTokenExpired } from '@/assets/auth'

import Home from '@/views/Home.vue'
import Users from '@/views/Users.vue'
import Login from '@/views/Login.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        admin: true,
        auth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

const authMiddleware = (router) => {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.matched.some(record => record.meta.auth)) {
      if (!token) {
        next({ path: '/login' })
      } else {
        if (isTokenExpired(token)) {
          store.dispatch('logout', router)

          next({ path: '/login' })
        } else {
          const user = getTokenBody(token)
          store.commit('login', user)

          next()
        }
      }
    } else if (to.name === 'login') {
      if (token && !isTokenExpired(token)) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}

export const adminMiddleware = (router) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.admin)) {
      if (store.getters['admin']) {
        next()
      } else {
        next({ path: '/' })
      }
    } else {
      next()
    }
  })
}

authMiddleware(router)
adminMiddleware(router)

export default router
