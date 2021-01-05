import request from '@/utils/request'
// 查询可以排班的医生列表（用户） 可以传部门ID 如果部门ID为空，则直接显示所有
// 用来填充下拉列表
// schedulingFlag  标志位
export function queryUsersNeedScheduling(deptId) {
  return request({
    url: '/doctor/scheduling/queryUsersNeedScheduling',
    params: { deptId: deptId }
  })
}
// 条件查询排班信息
export function queryScheduling(query) {
  return request({
    url: '/doctor/scheduling/queryScheduling',
    method: 'get',
    params: query
  })
}
// 保存排班数据
export function saveScheduling(data) {
  return request({
    url: '/doctor/scheduling/saveScheduling',
    method: 'post',
    data: data
  })
}
