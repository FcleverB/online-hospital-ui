import request from '@/utils/request'

// 分页查询批次库存及价格
export function listInventoryLogForPage(query) {
  return request({
    url: '/erp/inventoryLog/listInventoryLogForPage',
    method: 'get',
    params: query
  })
}
