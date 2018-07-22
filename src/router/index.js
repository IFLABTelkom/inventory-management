import Vue from 'vue'
import Router from 'vue-router'
import MainDashboard from '@/components/MainDashboard'
import LoginPage from '@/components/LoginPage'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'MainDashboard',
      component: MainDashboard
    },
    {
      path: '/login',
      name: 'Loginpage',
      component: LoginPage
    }

  ]
})
