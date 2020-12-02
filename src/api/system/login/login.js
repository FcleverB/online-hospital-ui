import request from '@/utils/request'

// 登录的后端接口
export function login(data) {
  // 向后端发送了一个post请求
  return request({
    url: '/login/doLogin',
    method: 'post',
    data // data是username和password
  })
}

// 登录成功之后获取用户信息的接口
export function getInfo(token) {
  return request({
    url: '/login/getInfo',
    method: 'get',
    params: { token }
  })
}

// 加载菜单信息
export function getMenus() {
  return request({
    url: '/login/getMenus',
    method: 'get'
  })
}

// 退出登录的接口
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

