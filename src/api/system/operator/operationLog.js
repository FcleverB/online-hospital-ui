import request from '@/utils/request'

// 分页查询操作日志信息
export function listForPage(query) {
  return request({
    url: '/system/operationLog/listForPage',
    method: 'get',
    params: query
  })
}

// 根据ID删除操作日志信息
export function deleteOperationLogByIds(ids) {
  return request({
    url: '/system/operationLog/deleteOperationLogByIds/' + ids,
    method: 'delete'
  })
}

// 清空所有操作日志
export function clearAllOperationLog() {
  return request({
    url: '/system/operationLog/clearAllOperationLog',
    method: 'delete'
  })
}
