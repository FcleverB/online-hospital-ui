// 收费管理
import request from '@/utils/request'

// 根据挂号单id查询病历|已支付的处方信息及详情信息
export function getChargedAllCareByRegistrationId(registrationId) {
  return request({
    url: '/doctor/backfee/getChargedAllCareByRegistrationId/' + registrationId,
    method: 'get'
  })
}

// 创建退费订单并现金退费
export function createOrderBackfeeWithCash(data) {
  return request({
    url: '/doctor/backfee/createOrderBackfeeWithCash',
    method: 'post',
    data: data
  })
}

// 创建退费订单并支付宝退费
export function createOrderBackfeeWithZfb(data) {
  return request({
    url: '/doctor/backfee/createOrderBackfeeWithZfb',
    method: 'post',
    data: data
  })
}

// 分页查询所有退费订单
export function queryAllOrderBackfeeForPage(query) {
  return request({
    url: '/doctor/backfee/queryAllOrderBackfeeForPage',
    method: 'get',
    params: query
  })
}

// 根据退费单主表id查询对应详情信息
export function queryOrderBackfeeItemByBackId(backId) {
  return request({
    url: '/doctor/backfee/queryOrderBackfeeItemByBackId/' + backId,
    method: 'get'
  })
}
