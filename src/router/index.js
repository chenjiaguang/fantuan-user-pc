import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TestEditor from '@/pages/TestEditor'

Vue.use(Router)
let prefix = '/user-pc'

export default new Router({
  routes: [
    {
      path: prefix + '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: prefix + '/testEditor',
      name: 'TestEditor',
      component: TestEditor
    }
  ],
  hashbang: false,
  history: true,
  mode: 'history'
})
