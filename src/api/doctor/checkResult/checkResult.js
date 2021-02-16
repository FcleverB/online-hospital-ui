// 收费管理
import request from '@/utils/request'

// 根据挂号单号和检查项目Id集合查询要检查的项目（已支付的检查项）
export function queryNeedCheckItem(query) {
  return request({
    url: '/doctor/check/queryNeedCheckItem',
    method: 'post',
    data: query
  })
}

// 根据详情Id查询对应病历|处方|处方详情
export function queryCheckItemByItemId(itemId) {
  return request({
    url: '/doctor/check/queryCheckItemByItemId/' + itemId,
    method: 'get'
  })
}

// 开始检查
export function startCheck(itemId) {
  return request({
    url: '/doctor/check/startCheck/' + itemId,
    method: 'post'
  })
}

// 查询所有检查中的项目
export function queryAllCheckingResultForPage(data) {
  return request({
    url: '/doctor/check/queryAllCheckingResultForPage',
    method: 'post',
    data: data
  })
}

// 完成检查
export function completeCheckResult(data) {
  return request({
    url: '/doctor/check/completeCheckResult',
    method: 'post',
    data: data
  })
}

// 查询所有检查项目
export function queryAllCheckResultForPage(data) {
  return request({
    url: '/doctor/check/queryAllCheckResultForPage',
    method: 'post',
    data: data
  })
}
