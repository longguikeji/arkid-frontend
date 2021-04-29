import { AuthApiNode } from '@/nodes/authApiNode'

export class Update extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    this.params = this.$state.fetch().params
    const outputs = await super.run()
    return outputs
  }
}
