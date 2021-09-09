import 'font-awesome/css/font-awesome.css'

import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import './config/axios'
import './config/mq'

import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// // TEMPORÁRIO
// require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkdhYnJpZWwgU2lsdmEgTm9yYmVydG8iLCJlbWFpbCI6InNuX2dhYnJpZWxAb3V0bG9vay5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjMwOTQ5ODc2LCJleHAiOjE2MzEyMDkwNzZ9.u7-sAim4X4Dbm55i5i9BhTf1IS3g_eMMRw09onfedWc'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')