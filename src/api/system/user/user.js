import request from '@/utils/request'

// 分页查询用户信息
export function listUserForPage(query) {
  return request({
    url: '/system/user/listUserForPage',
    method: 'get',
    params: query
  })
}

// 添加用户信息
export function addUser(data) {
  return request({
    url: '/system/user/addUser',
    method: 'post',
    data: data
  })
}

// 根据用户id查询对应的用户信息
export function getUserById(userId) {
  return request({
    url: '/system/user/getUserById/' + userId,
    method: 'get'
  })
}

// 修改用户信息
export function updateUser(data) {
  return request({
    url: '/system/user/updateUser',
    method: 'put',
    params: data
  })
}

// 根据id删除用户信息（含批量）
export function deleteUserByIds(userIds) {
  return request({
    url: '/system/user/deleteUserByIds/' + userIds,
    method: 'delete'
  })
}

// 重置用户密码
export function resetPassword(userIds) {
  return request({
    url: '/system/user/resetPassword/' + userIds,
    method: 'put'
  })
}

// 查询所有用户信息（可用|系统用户）
export function selectAllUser() {
  return request({
    url: '/system/user/selectAllUser',
    method: 'get'
  })
}

// 保存用户和角色的关联关系
export function saveUserAndRole(userId, roleIds) {
  // 角色id可能为空，默认设置一个-1
  if (roleIds.length === 0) {
    roleIds = [-1]
  }
  return request({
    url: '/system/user/saveUserAndRole/' + userId + '/' + roleIds,
    method: 'post'
  })
}
