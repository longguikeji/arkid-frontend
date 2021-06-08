import { AuthApiNode } from "@/nodes/authApiNode"
import { removeToken } from '@/utils/auth'

export class Logout extends AuthApiNode {
  async run() {
    const router = this.inputs.router
    this.url = '/api/v1/user/logout/'
    this.method = 'GET'
    const outputs = await super.run()
    if (outputs.is_succeed) {
      removeToken()
      router.push('/login')
    }
  }
}
