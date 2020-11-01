import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  // introduction: '',
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    // 从userInfo中取出用户名和密码
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 调用api/user.js中的方法，向后端发送请求
      login({ username: username.trim(), password: password }).then(response => {
        // 响应数据格式根据YApi来看，与原来不同了
        const { token } = response
        // 登录成功后，从响应数据中获取token，保存到Vuex中
        // commit调用了mutations中的SET_TOKEN方法保存了token信息
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // const { data } = response
        // if (!data) {
        //   reject('Verification failed, please Login again.')
        // }
        const { username, picture, roles, permissions } = response

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        if (!username) {
          reject('用户名为空，请重新登录!')
        }
        // 获取角色
        commit('SET_ROLES', roles)
        // 获取用户名
        commit('SET_NAME', username)
        // 获取头像
        commit('SET_AVATAR', picture)
        // 获取权限
        commit('SET_PERMISSIONS', permissions)
        // 获取介绍
        // commit('SET_INTRODUCTION', introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // 清空了token信息（在Vuex中）
        commit('SET_TOKEN', '')
        // 清空了角色信息（在Vuex中）
        commit('SET_ROLES', [])
        // 清空权限
        commit('SET_PERMISSIONS', [])
        // 删除token
        removeToken()
        // 重置路由
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // 清空token
      commit('SET_TOKEN', '')
      // 清空角色
      commit('SET_ROLES', [])
      // 清空权限
      commit('SET_PERMISSIONS', [])
      removeToken()
      resolve()
    })
  }

  // 动态改变权限
  // async changeRoles({ commit, dispatch }, role) {
  //   const token = role + '-token'
  //
  //   commit('SET_TOKEN', token)
  //   setToken(token)
  //
  //   const { roles } = await dispatch('getInfo')
  //
  //   resetRouter()
  //
  //   // generate accessible routes map based on roles
  //   const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //   // dynamically add accessible routes
  //   router.addRoutes(accessRoutes)
  //
  //   // reset visited views and cached views
  //   dispatch('tagsView/delAllViews', null, { root: true })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
