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

// 根据患者id查询患者的所有历史病历信息
export function getCareHistoryListByPatientId(patientId) {
  return request({
    url: '/doctor/care/getCareHistoryListByPatientId/' + patientId,
    method: 'get'
  })
}

// 保存病历信息
export function saveCareHistory(data) {
  return request({
    url: '/doctor/care/saveCareHistory',
    method: 'post',
    data: data
  })
}

// 根据挂号id查询病历信息
export function getCareHistoryByRegistrationId(registrationId) {
  return request({
    url: '/doctor/care/getCareHistoryByRegistrationId/' + registrationId,
    method: 'get'
  })
}

// 根据病历id查询处方和处方详情信息
export function queryOrdersByChId(chId) {
  return request({
    url: '/doctor/care/queryOrdersByChId/' + chId,
    method: 'get'
  })
}

// 保存处方和处方详情信息
export function saveCareOrderAndItem(data) {
  return request({
    url: '/doctor/care/saveCareOrderAndItem',
    method: 'post',
    data: data
  })
}

// 根据处方详情id删除处方详情信息
export function deleteCareOrderItemById(itemId) {
  return request({
    url: '/doctor/care/deleteCareOrderItemById/' + itemId,
    method: 'delete'
  })
}

// 完成就诊
export function visitComplete(registrationId) {
  return request({
    url: '/doctor/care/visitComplete/' + registrationId,
    method: 'put'
  })
}
