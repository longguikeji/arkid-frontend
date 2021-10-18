import { APINode } from '@/arkfbp/nodes/apiNode'

export class Fetch extends APINode {
  async run() {
    const { url, method } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    return {
      results: outputs.results,
      source: this.inputs
    }
  }
}
