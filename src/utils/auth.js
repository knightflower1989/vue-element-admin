import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const LoginTypeKey = 'Admin-Token-Login-Type'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLoginType() {
  return Cookies.get(LoginTypeKey)
}

export function setLoginType(loginType) {
  return Cookies.set(LoginTypeKey, loginType)
}

export function removeLoginType() {
  return Cookies.remove(LoginTypeKey)
}
