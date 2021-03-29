// import Cookies from 'js-cookie'

// const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem('userToken')
}

export function setToken(token: string) {
  return localStorage.setItem('userToken', token)
}

export function removeToken() {
  return localStorage.removeItem('userToken')
}
