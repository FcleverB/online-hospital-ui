// 引入路由
import { asyncRoutes, constantRoutes, lastRoute } from '@/router'
// 引入api中获取菜单信息的接口
import { getMenus } from '@/api/system/login/login'

const state = {
  routes: []
}
// 保存菜单信息到Vuex中
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

// 动态菜单定义在前端，后台只会返回对应登录用户有权限的菜单列表，通过遍历服务端的菜单数据，将没有获取到的菜单进行隐藏
// 这样的好处是服务端无需返回前端菜单相关结果，并且菜单显示又可以通过服务端来控制，进行菜单的动态控制
// 遵循了前后端分离的原则

// routes：前端定义写死的异步路由信息,srvMenus：从服务端获取的菜单信息，
function generateRoutes(routes, srvMenus) {
  // 遍历前端写死的异步路由列表
  for (let i = 0; i < routes.length; i++) {
    // 单个对象
    const routeItem = routes[i]
    // 设置默认不显示
    var showItem = false
    // 遍历服务端返回的当前用户可以操作的菜单
    for (let j = 0; j < srvMenus.length; j++) {
      // 单个对象
      const srvItem = srvMenus[j]
      // 如果前端路由对应不是undefined 并且 前端路由的name与服务端路由的name相等，且服务端菜单show为true
      // 前后端数据通过 serPath 属性来匹配
      if (routeItem.name !== undefined && routeItem.name === srvItem.serPath && srvItem.show === true) {
        // 那么该前端路由菜单需要显示
        showItem = true
        // 隐藏属性设置为false
        routes[i]['hidden'] = false
        break
      }
    }
    // 如果遍历的单个前端路由菜单依旧是false，表示并没有和服务端返回的菜单数据匹配，那么设置hidden为true
    if (showItem === false) {
      routes[i]['hidden'] = true
    }
    /**
     * 下面的if判断是否可以放入break前面呢？如果一级菜单都不行，那么二级菜单肯定也不能显示
     * 上面如果showItem已经判断为false，表示一级菜单不能显示，就算一级菜单下面还有二级菜单还有什么意义呢
      */
    // 深层次遍历子节点，如果当前前端菜单的children子节点不为空，并且长度大于0，那么继续匹配子菜单节点是否显示
    if (routeItem['children'] !== undefined && routeItem['children'].length > 0) {
      generateRoutes(routes[i]['children'], srvMenus)
    }
  }
}

const actions = {
  getMenus({ commit }, roles) {
    return new Promise(resolve => {
      // 查询与当前登录用户角色的菜单数据
      getMenus(state.token).then(async function(res) {
        // res:{“msg":"","code":"","data":[{"id":"","serPath":"","show":boolean},{}....]
        // 获取服务端返回的菜单数组对象
        const srvMenus = res.data
        // 获取异步路由对象
        var pushRouter = asyncRoutes
        // 根据服务端返回的菜单与前端定义的菜单数据进行匹配
        generateRoutes(pushRouter, srvMenus)
        // 定义常量保存实际需要显示的菜单信息
        const routeArr = []
        // 保存常量路由
        routeArr.push(...constantRoutes)
        // 保存与服务端动态匹配的路由
        routeArr.push(...pushRouter)
        // 保存
        routeArr.push(...lastRoute)
        commit('SET_ROUTES', routeArr)// 放到vuex里面
        resolve(routeArr)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
