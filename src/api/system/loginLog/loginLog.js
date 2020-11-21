import request from '@/utils/request'

// 分页查询登录日志信息
export function listForPage(query) {
  return request({
    url: '/system/loginLog/listForPage',
    method: 'get',
    params: query
  })
}

// 根据id删除登录日志信息
export function deleteLoginLogByIds(infoIds) {
  return request({
    url: '/system/loginLog/deleteLoginLogByIds/' + infoIds,
    method: 'delete'
  })
}

// 清空所有登录日志信息
export function clearAllLoginLog() {
  return request({
    url: '/system/loginLog/clearAllLoginLog',
    method: 'delete'
  })
}
