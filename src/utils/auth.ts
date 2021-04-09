import LoginStore from '@/login/store/login'

export function getToken() {
  return LoginStore.token
}

export function setToken(token: string) {
  LoginStore.token = token
}

export function removeToken() {
  LoginStore.removeToken()
}
