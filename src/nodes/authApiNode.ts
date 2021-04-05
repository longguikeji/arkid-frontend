import { APINode } from "arkfbp/lib/apiNode";
import { getToken } from '@/utils/auth'
import getPageState, { getPreviousPageState } from '@/utils/get-page-state'

export class AuthApiNode extends APINode {
  async run() {
    const token = getToken()
    if (token) {
      this.headers = {
        Authorization: 'Token ' + getToken()
      }
    }
    return super.run()
  }

  getState(path: string = '') {
    return getPageState(path)
  }

  getPreviousState() {
    return getPreviousPageState()
  }
}