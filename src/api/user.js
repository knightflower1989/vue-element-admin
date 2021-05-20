import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function xxx_login(data) {
  return request({
    url: '/api/user/xxx_login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function getOauthInfo(data) {
  return request({
    url: '/api/user/oauth_info',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function update(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}

export function updateAvatar(data) {
  return request({
    url: '/api/user/avatar',
    method: 'post',
    data
  })
}

export function userRoleInfo(data) {
  return request({
    url: '/api/user/role_info_list',
    method: 'post',
    params: data
  })
}

export function userLogList(data) {
  return request({
    url: '/api/user/log',
    method: 'post',
    params: data
  })
}

export function userRoutePolicy(data) {
  return request({
    url: '/api/user/route_policy',
    method: 'post',
    params: data
  })
}
