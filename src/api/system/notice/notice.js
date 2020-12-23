import request from '@/utils/request'

// 修改通知公告信息
export function updateNotice(data) {
  return request({
    url: '/system/notice/updateNotice',
    method: 'put',
    params: data
  })
}

// 分页查询通知公告
export function listNoticeForPage(query) {
  return request({
    url: '/system/notice/listNoticeForPage',
    method: 'get',
    params: query
  })
}

// 根据id删除通知公告
export function deleteNoticeByIds(noticeIds) {
  return request({
    url: '/system/notice/deleteNoticeByIds/' + noticeIds,
    method: 'delete'
  })
}

// 根据id查询对应通知公告信息
export function getNoticeById(noticeId) {
  return request({
    url: '/system/notice/getNoticeById/' + noticeId,
    method: 'get'
  })
}

// 添加通知公告
export function addNotice(data) {
  return request({
    url: '/system/notice/addNotice',
    method: 'post',
    data: data
  })
}
