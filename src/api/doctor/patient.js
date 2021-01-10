import request from '@/utils/request'

// 分页查询所有患者信息
export function listPatientForPage(query) {
  return request({
    url: '/doctor/patient/listPatientForPage',
    method: 'get',
    params: query
  })
}

// 根据id查询对应患者信息
export function getPatientById(patientId) {
  return request({
    url: '/doctor/patient/getPatientById/' + patientId,
    method: 'get'
  })
}

// 根据患者信息主键id查询患者档案信息
export function getPatientFileById(patientId) {
  return request({
    url: '/doctor/patient/getPatientFileById/' + patientId,
    method: 'get'
  })
}
