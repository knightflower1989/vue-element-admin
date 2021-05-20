import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/group/list',
    method: 'get',
    params: query
  })
}

export function fetchGroup(id) {
  return request({
    url: '/api/group/detail',
    method: 'get',
    params: { id }
  })
}

export function createGroup(data) {
  return request({
    url: '/api/group/create',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/api/group/update',
    method: 'post',
    data
  })
}

export function modifyGroupStatus(query) {
  return request({
    url: '/api/group/modify_status',
    method: 'post',
    params: query
  })
}

export function deleteGroup(query) {
  return request({
    url: '/api/group/delete',
    method: 'post',
    params: query
  })
}

export function fetchGameIdList(query) {
  return request({
    url: '/api/game/id_list',
    method: 'get',
    params: query
  })
}
