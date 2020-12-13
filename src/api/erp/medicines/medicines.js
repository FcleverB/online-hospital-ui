import request from '@/utils/request'

// 修改药品信息
export function updateMedicines(data) {
  return request({
    url: '/erp/medicines/updateMedicines',
    method: 'put',
    params: data
  })
}

// 分页查询药品信息
export function listMedicinesForPage(query) {
  return request({
    url: '/erp/medicines/listMedicinesForPage',
    method: 'get',
    params: query
  })
}

// 根据id删除药品
export function deleteMedicinesByIds(medicinesIds) {
  return request({
    url: '/erp/medicines/deleteMedicinesByIds/' + medicinesIds,
    method: 'delete'
  })
}

// 根据id查询药品信息
export function getMedicinesById(medicinesId) {
  return request({
    url: '/erp/medicines/getMedicinesById/' + medicinesId,
    method: 'get'
  })
}

// 查询所有药品信息
export function selectAllMedicines() {
  return request({
    url: '/erp/medicines/selectAllMedicines',
    method: 'get'
  })
}

// 添加药品信息
export function addMedicines(data) {
  return request({
    url: '/erp/medicines/addMedicines',
    method: 'post',
    params: data
  })
}

// 修改药品信息
export function updateMedicinesStock(medicinesId, medicinesStockNum) {
  return request({
    url: '/erp/medicines/updateMedicinesStock/' + medicinesId + '/' + medicinesStockNum,
    method: 'put'
  })
}
