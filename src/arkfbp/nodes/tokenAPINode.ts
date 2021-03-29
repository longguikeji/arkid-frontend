import { APINode } from 'arkfbp/lib/apiNode'
import { getToken } from '@/utils/auth'
export class TokenAPINode extends APINode {
  async run() {
    const token = getToken()
    if (token) {
      this.headers = {
        Authorization: 'Token ' + getToken()
      }
    }
    return super.run()
  }
}
