import request from '@/utils/request'

// 分页查询有排班的科室信息
export function listDeptForScheduling(query) {
  return request({
    url: '/doctor/registration/listDeptForScheduling',
    method: 'get',
    params: query
  })
}

// 根据身份证号查询患者信息
export function getPatientByIdCard(idCard) {
  return request({
    url: '/doctor/registration/getPatientByIdCard/' + idCard,
    method: 'get'
  })
}
