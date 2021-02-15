// 收费管理
import request from '@/utils/request'

// 处方发药
export function doMedicine(itemIds) {
  return request({
    url: '/doctor/handleMedicine/doMedicine',
    method: 'post',
    data: itemIds
  })
}

// 根据挂号单id查询病历|已支付的处方信息及详情信息
export function getChargedCareHistoryOnlyMedicinesByRegistrationId(registrationId) {
  return request({
    url: '/doctor/handleMedicine/getChargedCareHistoryOnlyMedicinesByRegistrationId/' + registrationId,
    method: 'get'
  })
}
