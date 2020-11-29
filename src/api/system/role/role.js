import request from '@/utils/request'

// 分页查询
export function listRoleForPage(query) {
  return request({
    url: '/system/role/listRoleForPage',
    method: 'get',
    params: query
  })
}

// 添加角色信息
export function addRole(data) {
  return request({
    url: '/system/role/addRole',
    method: 'post',
    params: data
  })
}

// 根据角色id查询角色信息
export function getRoleById(roleId) {
  return request({
    url: '/system/role/getRoleById/' + roleId,
    method: 'get'
  })
}

// 修改角色信息
export function updateRole(data) {
  return request({
    url: '/system/role/updateRole',
    method: 'put',
    params: data
  })
}

// 根据角色删除角色信息（含批量和删除角色-用户表和角色-菜单表数据）
export function deleteRoleByIds(roleIds) {
  return request({
    url: '/system/role/deleteRoleByIds' + roleIds,
    method: 'delete'
  })
}

// 查询所有角色信息（可用状态）
export function selectAllRoles() {
  return request({
    url: '/system/role/selectAllRoles',
    method: 'get'
  })
}

