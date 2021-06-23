import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Fetch extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    this.params = this.inputs.params
    const outputs = await super.run()
    this.$state.commit((state: any) => {
      state.inputs = this.inputs
    })
    return outputs
  }
}
