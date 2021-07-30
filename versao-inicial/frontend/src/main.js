import 'font-awesome/css/font-awesome.css'

import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// TEMPORÁRIO
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwibmFtZSI6IkdhYnJpZWwgTm9yYmVydG8iLCJlbWFpbCI6InNuX2dhYnJpZWxAb3V0bG9vay5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjI3NjU2MDM0LCJleHAiOjE2Mjc5MTUyMzR9.hl5JHee4tJ1T5lgpS7lOXpPIL1sUwbcFoiimSkfRsWE'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')