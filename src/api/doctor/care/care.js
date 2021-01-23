import request from '@/utils/request'

// 查询待就诊的挂号信息
export function queryToBeSeenRegistration(schedulingType) {
  return request({
    url: '/doctor/care/queryToBeSeenRegistration/' + schedulingType,
    method: 'get'
  })
}

// 查询就诊中的挂号信息
export function queryVisitingRegistration(schedulingType) {
  return request({
    url: '/doctor/care/queryVisitingRegistration/' + schedulingType,
    method: 'get'
  })
}

// 查询就诊完成的挂号信息
export function queryVisitCompleteRegistration(schedulingType) {
  return request({
    url: '/doctor/care/queryVisitCompleteRegistration/' + schedulingType,
    method: 'get'
  })
}

// 医生接诊
export function receivePatient(registrationId) {
  return request({
    url: '/doctor/care/receivePatient/' + registrationId,
    method: 'put'
  })
}

// 根据患者id查询患者信息、档案信息、病例信息
export function getPatientAllMessageByPatientId(patientId) {
  return request({
    url: '/doctor/care/getPatientAllMessageByPatientId/' + patientId,
    method: 'get'
  })
}
