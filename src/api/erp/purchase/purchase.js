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
    method: 'get',
    params: query
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

// 生成入库单据id
export function generatePurchaseId() {
  return request({
    url: '/erp/purchase/generatePurchaseId',
    method: 'get'
  })
}

// 暂存入库单据和详情信息
export function addPurchase(data) {
  return request({
    url: '/erp/purchase/addPurchase',
    method: 'post',
    data: data
  })
}

// 添加入库单据和详情信息并提交审核
export function addPurchaseToAudit(data) {
  return request({
    url: '/erp/purchase/addPurchaseToAudit',
    method: 'post',
    data: data
  })
}

// 根据入库单据id查询入库单据信息和详情信息
export function queryPurchaseAndItemByPurchaseId(purchaseId) {
  return request({
    url: '/erp/purchase/queryPurchaseAndItemByPurchaseId/' + purchaseId,
    method: 'get'
  })
}

// 入库【根据入库单据id】
export function doInventory(purchaseId) {
  return request({
    url: '/erp/purchase/doInventory/' + purchaseId,
    method: 'put'
  })
}
