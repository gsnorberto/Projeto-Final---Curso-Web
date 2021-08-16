import 'font-awesome/css/font-awesome.css'

import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// TEMPORÁRIO
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkdhYnJpZWwgU2lsdmEgTm9yYmVydG8iLCJlbWFpbCI6InNuX2dhYnJpZWxAb3V0bG9vay5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjI5MDM0OTc5LCJleHAiOjE2MjkyOTQxNzl9.oONg1LJhwKeUTKT3g_skRI8MZ2nfJWyuiVC1NgMJXhw'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')