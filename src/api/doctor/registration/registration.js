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

// 挂号功能
export function addRegistration(data) {
  return request({
    url: '/doctor/registration/addRegistration',
    method: 'post',
    data: data
  })
}

// 收费（修改对应挂号信息的状态）
export function charge(registrationId) {
  return request({
    url: '/doctor/registration/charge/' + registrationId,
    method: 'put'
  })
}

// 分页查询挂号信息
export function queryRegistrationForPage(query) {
  return request({
    url: '/doctor/registration/queryRegistrationForPage',
    method: 'get',
    params: query
  })
}

// 作废【根据挂号流水号】
export function doInvalid(registrationId) {
  return request({
    url: '/doctor/registration/doInvalid/' + registrationId,
    method: 'put'
  })
}

// 退号【根据挂号流水号】
export function doReturn(registrationId) {
  return request({
    url: '/doctor/registration/doReturn/' + registrationId,
    method: 'put'
  })
}
