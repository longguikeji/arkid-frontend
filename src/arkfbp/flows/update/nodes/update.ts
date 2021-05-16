import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Update extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    this.params = this.inputs.params
    const outputs = await super.run()
    return outputs
  }
}
