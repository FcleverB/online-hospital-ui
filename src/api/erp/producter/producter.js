import request from '@/utils/request'

// 修改生产厂家信息
export function updateProducter(data) {
  return request({
    url: '/erp/producter/updateProducter',
    method: 'put',
    params: data
  })
}

// 分页查询生产厂家信息
export function listProducterForPage(query) {
  return request({
    url: '/erp/producter/listProducterForPage',
    method: 'get',
    params: query
  })
}

// 根据id删除生产厂家
export function deleteProducterByIds(producterIds) {
  return request({
    url: '/erp/producter/deleteProducterByIds/' + producterIds,
    method: 'delete'
  })
}

// 根据id查询生产厂家信息
export function getProducterById(producterId) {
  return request({
    url: '/erp/producter/getProducterById/' + producterId,
    method: 'get'
  })
}

// 查询所有生产厂家信息
export function selectAllProducter() {
  return request({
    url: '/erp/producter/selectAllProducter',
    method: 'get'
  })
}

// 添加生产厂家信息
export function addProducter(data) {
  return request({
    url: '/erp/producter/addProducter',
    method: 'post',
    data: data
  })
}
