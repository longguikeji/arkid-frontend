import { FunctionNode } from 'arkfbp/lib/functionNode'
import { setToken } from '@/utils/auth'

export class EnterThisAccountNode extends FunctionNode {
  async run() {
    const { previous } = this.inputs
    const token = previous.token
    if (token) {
      setToken(token)
      window.location.reload()
    }
  }
}