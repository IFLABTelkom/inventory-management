import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import MainDashboard from '@/components/MainDashboard'
import LoginPage from '@/components/LoginPage'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'MainDashboard',
      component: MainDashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Loginpage',
      component: LoginPage,
      meta: {
        requiresGuest: true
      }
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
