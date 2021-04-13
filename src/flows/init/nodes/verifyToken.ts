import { APINode } from "arkfbp/lib/apiNode";
import { getToken, removeToken } from "@/utils/auth"

export class VerifyToken extends APINode {
  async run() {
    // init 初始化时判断此时的 token 是否有效
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
