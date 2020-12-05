import request from '@/utils/request'

// 修改检查项目
export function updateCheckItem(data) {
  return request({
    url: '/system/checkItem/updateCheckItem',
    method: 'put',
    params: data
  })
}

// 分页查询检查项目
export function listCheckItemForPage(query) {
  return request({
    url: '/system/checkItem/listCheckItemForPage',
    method: 'get',
    params: query
  })
}

// 根据id删除一个检查项目
export function deleteCheckItemByIds(checkItemIds) {
  return request({
    url: '/system/checkItem/deleteCheckItemByIds/' + checkItemIds,
    method: 'delete'
  })
}

// 根据id查询一个检查项目
export function getCheckItemById(checkItemId) {
  return request({
    url: '/system/checkItem/getCheckItemById/' + checkItemId,
    method: 'get'
  })
}

// 查询所有可用的检查项目
export function selectAllCheckItem() {
  return request({
    url: '/system/checkItem/selectAllCheckItem',
    method: 'get'
  })
}

// 添加检查项目
export function addCheckItem(data) {
  return request({
    url: '/system/checkItem/addCheckItem',
    method: 'post',
    params: data
  })
}
