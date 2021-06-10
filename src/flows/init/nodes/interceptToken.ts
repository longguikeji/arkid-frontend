import { IFNode } from "arkfbp/lib/ifNode"
import { getUrlParamByName } from '@/utils/url'
import { setToken, getToken } from '@/utils/auth'

export class InterceptToken extends IFNode {

  interceptToken() {
    if (window.location.pathname === '/' && window.location.search.includes('token')) {
      const token = getUrlParamByName('token') as string
      setToken(token)
      const url = window.location.origin + '/' + process.env.VUE_APP_BASE_API
      window.location.replace(url)
    }
  }

  condition() {
    this.interceptToken()
    return getToken() !== null
  }
}
