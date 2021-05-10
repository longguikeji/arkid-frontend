import { APINode } from "arkfbp/lib/apiNode"
import { getToken } from '@/utils/auth'
import { getBaseState } from '@/utils/get-page-state'

export class AuthApiNode extends APINode {
  async run() {
    const token = getToken()
    if (token) {
      this.headers = {
        Authorization: 'Token ' + token
      }
    }
    return super.run()
  }
  
  getBaseState() {
    return getBaseState()
  }
  
}
