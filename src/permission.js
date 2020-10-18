import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 全局前置守卫，触发任意导航时，都会触发全局前置守卫
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置网页标题
  document.title = getPageTitle(to.meta.title)

  // 获取页面的token信息，判断用户是否已经登录
  const hasToken = getToken()

  if (hasToken) {
    // 已经登录了，判断请求路由是否为login，如果是login则不需要重复登录，直接跳转到首页即可
    if (to.path === '/login') {
      // 如果已经登录过了，那么跳转到首页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 如果请求路由不是去往登录页面，那么就需要判断当前用户的角色，来决定能否跳转到目标路由
      // 确定用户是否通过getInfo获得了他的角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果已经获得了角色，那么就可以跳转到目标路由
      if (hasRoles) {
        next()
      } else {
        // 如果没有对应的角色，那么就需要请求后台获取用户信息和权限信息
        try {
          // 说明：角色必须是一个对象数组类型，比如【‘admin’】或者【‘developer’，‘editor’】
          const { roles } = await store.dispatch('user/getInfo')

          // 基于角色生成动态路由【菜单和权限】
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加路由
          router.addRoutes(accessRoutes)

          // hack方法，以确保addRoutes是完整的
          // 设置replace: true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 如果出错，则请求后台重置用户token并且跳转到登录页面，重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 没有token，需要登录
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      // 如果在免登陆白名单中，则直接不需登录直接进入
      next()
    } else {
      // 否则将被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置钩子
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
