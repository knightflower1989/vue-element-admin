import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/code/list',
    method: 'get',
    params: query
  })
}

export function fetchAccount(id) {
  return request({
    url: '/api/code/detail',
    method: 'get',
    params: { id }
  })
}

export function createAccount(data) {
  return request({
    url: '/api/code/create',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/api/code/update',
    method: 'post',
    data
  })
}

export function modifyAccountStatus(query) {
  return request({
    url: '/api/code/modify_status',
    method: 'post',
    params: query
  })
}

export function deleteAccount(query) {
  return request({
    url: '/api/code/delete',
    method: 'post',
    params: query
  })
}

export function fetchGroupIdList(query) {
  return request({
    url: '/api/group/group_id_list',
    method: 'get',
    params: query
  })
}
