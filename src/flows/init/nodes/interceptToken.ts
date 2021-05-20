import { FunctionNode } from 'arkfbp/lib/functionNode'
import { getUrlParamByName } from '@/utils/url'
import { setToken } from '@/utils/auth'

export class InterceptToken extends FunctionNode {
  async run() {
    if (window.location.pathname === '/' && window.location.search.includes('token')) {
      const token = getUrlParamByName('token') as string
      setToken(token)
      const url = window.location.origin + '/' + process.env.VUE_APP_BASE_API
      window.location.replace(url)
    }
  }
}
