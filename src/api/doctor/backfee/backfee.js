// 收费管理
import request from '@/utils/request'

// 根据挂号单id查询病历|已支付的处方信息及详情信息
export function getChargedAllCareByRegistrationId(registrationId) {
  return request({
    url: '/doctor/backfee/getChargedAllCareByRegistrationId/' + registrationId,
    method: 'get'
  })
}

