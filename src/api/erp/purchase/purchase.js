import request from '@/utils/request'

// 分页查询所有采购入库列表
export function listPurchaseForPage(query) {
  return request({
    url: '/erp/purchase/listPurchaseForPage',
    method: 'get',
    params: query
  })
}

// 提交审核【根据采购单据id】
export function doAudit(purchaseId) {
  return request({
    url: '/erp/purchase/doAudit/' + purchaseId,
    method: 'put'
  })
}

// 作废【根据采购单据id】
export function doInvalid(purchaseId) {
  return request({
    url: '/erp/purchase/doInvalid/' + purchaseId,
    method: 'put'
  })
}

// 分页查询所有待审核的入库列表
export function listPurchasePendingForPage(query) {
  return request({
    url: '/erp/purchase/listPurchasePendingForPage',
    method: 'get'
  })
}

// 审核通过【根据采购单据id】
export function auditPass(purchaseId) {
  return request({
    url: '/erp/purchase/auditPass/' + purchaseId,
    method: 'put'
  })
}

// 审核不通过【根据采购单据id】
export function auditRefuse(purchaseId, auditMsg) {
  return request({
    url: '/erp/purchase/auditRefuse/' + purchaseId + '/' + auditMsg,
    method: 'put'
  })
}

// 根据采购单据id查询采购单据详情信息
export function getPurchaseItemById(purchaseId) {
  return request({
    url: '/erp/purchase/getPurchaseItemById/' + purchaseId,
    method: 'get'
  })
}
