import { APINode } from "arkfbp/lib/apiNode"
import { getToken } from '@/utils/auth'
import getPageState, { getPreviousPageState, getBaseState } from '@/utils/get-page-state'

export class AuthApiNode extends APINode {
  async run() {
    const token = getToken()
    if (token) {
      this.headers = {
        Authorization: 'Token ' + token,
        ...this.initHeaders()
      }
    }
    return super.run()
  }

  getState(path = '') {
    return getPageState(path)
  }

  getPreviousState() {
    return getPreviousPageState()
  }

  getBaseState() {
    return getBaseState()
  }

  initHeaders() {
    return {}
  }
}
