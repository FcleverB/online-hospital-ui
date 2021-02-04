// 收费管理
import request from '@/utils/request'

// 根据挂号单id查询病历|未支付的处方信息及详情信息
export function getNoChargeAllCareByRegistrationId(registrationId) {
  return request({
    url: '/doctor/charge/getNoChargeAllCareByRegistrationId/' + registrationId,
    method: 'get'
  })
}

// 创建订单并现金支付
export function createOrderChargeWithCash(data) {
  return request({
    url: '/doctor/charge/createOrderChargeWithCash',
    method: 'post',
    data: data
  })
}
