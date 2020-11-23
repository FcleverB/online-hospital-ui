import request from '@/utils/request'

// 修改科室信息
export function updateDept(data) {
  return request({
    url: '/system/dept/updateDept',
    method: 'put',
    params: data
  })
}

// 分页查询科室信息
export function listForPage(query) {
  return request({
    url: '/system/dept/listForPage',
    method: 'get',
    params: query
  })
}

// 查询所有科室信息(状态为有效）
export function selectAllDept() {
  return request({
    url: '/system/dept/selectAllDept',
    method: 'get'
  })
}

// 根据id删除科室信息
export function deleteDeptByIds(deptIds) {
  return request({
    url: '/system/dept/deleteDeptByIds/' + deptIds,
    method: 'delete'
  })
}

// 根据id查询科室信息
export function getDeptById(deptId) {
  return request({
    url: '/system/dept/getDeptById/' + deptId,
    method: 'get'
  })
}

// 添加科室信息
export function addDept(data) {
  return request({
    url: '/system/dept/addDept',
    method: 'post',
    params: data
  })
}
