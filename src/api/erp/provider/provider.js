import request from '@/utils/request'

// 修改供应商信息
export function updateProvider(data) {
  return request({
    url: '/erp/provider/updateProvider',
    method: 'put',
    params: data
  })
}

// 分页查询供应商信息
export function listProviderForPage(query) {
  return request({
    url: '/erp/provider/listProviderForPage',
    method: 'get',
    params: query
  })
}

// 根据id删除供应商
export function deleteProviderByIds(providerIds) {
  return request({
    url: '/erp/provider/deleteProviderByIds/' + providerIds,
    method: 'delete'
  })
}

// 根据id查询供应商信息
export function getProviderById(providerId) {
  return request({
    url: '/erp/provider/getProviderById/' + providerId,
    method: 'get'
  })
}

// 查询所有供应商信息
export function selectAllProvider() {
  return request({
    url: '/erp/provider/selectAllProvider',
    method: 'get'
  })
}

// 添加供应商信息
export function addProvider(data) {
  return request({
    url: '/erp/provider/addProvider',
    method: 'post',
    params: data
  })
}
