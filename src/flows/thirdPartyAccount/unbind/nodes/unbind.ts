import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'

export class Unbind extends AuthApiNode {
  async run() {
    const data = this.inputs.com.state.data
    this.url = data.unbind
    this.method = 'GET'
    await super.run()
  }
}
