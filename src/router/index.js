import Vue from 'vue'
import Router from 'vue-router'
const HelloWorld = resolve => require(['@/components/HelloWorld'], resolve)
const NotFoundPage = resolve => require(['@/pages/notFoundPage'], resolve)
const ScanCode = resolve => require(['@/pages/scanCode'], resolve)

Vue.use(Router)
let prefix = '/user-pc'

const router = new Router({
  routes: [
    {
      path: '*', // 所有404页面，（未能正确匹配路由时显示的页面）
      name: 'NotFoundPage',
      meta: {
        title: '范团'
      },
      component: NotFoundPage
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        title: 'hello world',
        keepAlive: false
      }
    },
    {
      path: prefix + '/scancode',
      name: 'ScanCode',
      component: ScanCode,
      meta: {
        title: '扫码编辑',
        keepAlive: false
      }
    }
  ],
  hashbang: false,
  history: true,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    // let i = document.createElement('iframe')
    // i.src = 'https://www.baidu.com/favicon.ico'
    // i.style.display = 'none'
    // i.onload = () => {
    //   i.remove()
    // }
    document.title = to.meta.title
    // document.body.appendChild(i)
    next()
  } else {
    document.title = '\u200E'
    next()
  }
})

export default router
