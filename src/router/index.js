import Vue from 'vue'
import Router from 'vue-router'
import MainDashboard from '@/components/MainDashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'MainDashboard',
      component: MainDashboard
    },

  ]
})
