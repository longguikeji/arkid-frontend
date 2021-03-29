import { APINode } from 'arkfbp/lib/apiNode'

export class ServeConfig extends APINode {
  async run() {
    this.url = this.inputs.url
    this.method = 'GET'
    const outputs = await super.run()
    return outputs
  }
}
