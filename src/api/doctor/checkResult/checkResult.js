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
