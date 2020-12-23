import request from '@/utils/request'

// 修改挂号信息
export function updateRegisteredItem(data) {
  return request({
    url: '/system/registeredItem/updateRegisteredItem',
    method: 'put',
    params: data
  })
}

// 分页查询挂号信息
export function listRegisteredItemForPage(query) {
  return request({
    url: '/system/registeredItem/listRegisteredItemForPage',
    method: 'get',
    params: query
  })
}

// 查询所有可用的挂号信息
export function selectAllRegisteredItem() {
  return request({
    url: '/system/registeredItem/selectAllRegisteredItem',
    method: 'get'
  })
}

// 根据id删除挂号信息
export function deleteRegisteredItemByIds(regItemIds) {
  return request({
    url: '/system/registeredItem/deleteRegisteredItemByIds/' + regItemIds,
    method: 'delete'
  })
}

// 根据id查询挂号信息
export function getRegisteredItemById(regItemId) {
  return request({
    url: '/system/registeredItem/getRegisteredItemById/' + regItemId,
    method: 'get'
  })
}

// 添加挂号费用
export function addRegisteredItem(data) {
  return request({
    url: '/system/registeredItem/addRegisteredItem',
    method: 'post',
    data: data
  })
}

