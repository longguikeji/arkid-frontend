import { APINode } from "arkfbp/lib/apiNode";
import { getToken, removeToken } from "@/utils/auth"

export class VerifyToken extends APINode {
  async run() {
    const token = getToken()
    if (token) {
      this.url = '/api/v1/user/token/'
      this.method = 'POST'
      this.params = {
        token: token,
      }
      const isValid = await super.run()
      if (!isValid) {
        removeToken()
      }
    }
  }
}
