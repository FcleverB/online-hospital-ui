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
