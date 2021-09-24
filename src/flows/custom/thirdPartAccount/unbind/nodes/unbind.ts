import { APINode } from '@/arkfbp/nodes/apiNode'

export class Unbind extends APINode {
  async run() {
    const data = this.inputs.com.state.data
    this.url = data.unbind
    this.method = 'GET'
    await super.run()
  }
}
