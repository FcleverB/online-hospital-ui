import request from '@/utils/request'

// 更新菜单数据
export function updateMenu(data) {
  return request({
    url: '/system/menu/updateMenu',
    method: 'put',
    params: data
  })
}

// 查询所有菜单数据
export function listAllMenus(query) {
  return request({
    url: '/system/menu/listAllMenus',
    method: 'get',
    params: query
  })
}

// 查询菜单树
export function selectMenuTree() {
  return request({
    url: '/system/menu/selectMenuTree',
    method: 'get'
  })
}

// 根据菜单id删除菜单信息
export function deleteMenuById(menuId) {
  return request({
    url: '/system/menu/deleteMenuById/' + menuId,
    method: 'delete'
  })
}

// 根据菜单id查询指定菜单数据
export function getMenuById(menuId) {
  return request({
    url: '/system/menu/getMenuById/' + menuId,
    method: 'get'
  })
}

// 添加菜单信息
export function addMenu(data) {
  return request({
    url: '/system/menu/addMenu',
    method: 'post',
    data: data
  })
}

// 根据角色ID查询该角色已分配菜单ID
export function getMenuIdsByRoleId(roleId) {
  return request({
    url: '/system/menu/getMenuIdsByRoleId/' + roleId,
    method: 'get'
  })
}
