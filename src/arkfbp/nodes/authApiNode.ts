import { APINode } from "arkfbp/lib/apiNode"
import { getToken, removeToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'

export class AuthApiNode extends APINode {
  async run() {
    const token = getToken()
    const url = this.url
    const method = this.method
    const params = this.params
    if (token) {
      this.url = '/api/v1/user/token/'
      this.method = 'POST'
      this.params = {
        token: token,
      }
      const isValid = await super.run()
      if (!isValid) {
        removeToken()
        if (window.location.pathname !== '/login') {
          window.location.replace(window.location.origin + getBaseUrl() + '/login')
        }
      } else {
        this.headers = {
          ...this.$state.fetch().headers,
          Authorization: 'Token ' + token
        }
        this.url = url
        this.method = method
        this.params = params
        const outputs = await super.run()
        return outputs
      }
    }
  }
}