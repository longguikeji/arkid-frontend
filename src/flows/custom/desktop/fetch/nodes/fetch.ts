import { APINode } from '@/arkfbp/nodes/apiNode'

export class Fetch extends APINode {
  async run() {
    const { url, method, client, com } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    return {
      apps: outputs.results,
      state: client,
      com
    }
  }
}
