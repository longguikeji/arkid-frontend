import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Options extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    this.params = this.inputs.params
    this.$state.commit((state: any) => {
      state.client = this.inputs.client
      state.clientServer = this.inputs.clientServer
    })
    const outputs = await super.run()
    return outputs
  }
}
