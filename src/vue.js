import Vue from 'vue'
import Vuex from 'vuex'
import ajax from './lib/ajax'
import toast from './components/toast'
import '@/iconfont/iconfont.css'

// import VConsole from 'vconsole/dist/vconsole.min.js' // import vconsole

/* eslint-disable no-new */
// if (process.env.NODE_ENV !== 'production') { // 非正式环境包，就实例化vconsole
//   new VConsole() // 初始化
// }
Vue.prototype.$assetsPublicPath = '/user-pc'
Vue.prototype.$apiDomain = process.env.API_DOMAIN
Vue.prototype.$apiDomainHttps = process.env.API_DOMAIN_HTTPS
Vue.prototype.$imageUploadUrl = process.env.IMAGE_UPLOAD_URL
Vue.prototype.$useHttps = process.env.HTTPS
Vue.prototype.$locationDomain = process.env.LOCATION_DOMAIN
Vue.prototype.$ajax = ajax
Vue.prototype.$toast = toast
Vue.use(Vuex)

export default Vue
