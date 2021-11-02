import { APINode } from '@/arkfbp/nodes/apiNode'

export class AppSubscribeNode extends APINode {
  async run() {
    const { url, method, com } = this.inputs
    this.url = url
    this.method = method
    this.params = {
      status: com.state.value
    }
    await super.run()
  }
}
