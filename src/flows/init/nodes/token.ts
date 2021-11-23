import { IFNode } from "arkfbp/lib/ifNode"
import { getUrlParamByName } from '@/utils/url'
import { setToken, getToken } from '@/utils/auth'

export class TokenNode extends IFNode {

  interceptToken() {
    const flag = (window.location.pathname === '/' || window.location.pathname === '/desktop') && window.location.search.includes('token') 
    if (flag) {
      const token = getUrlParamByName('token') as string
      setToken(token)
    }
  }

  condition() {
    this.interceptToken()
    return getToken() !== null
  }
}
