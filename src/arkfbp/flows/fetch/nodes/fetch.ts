import { AuthApiNode } from '@/nodes/authApiNode'
import { proxyClientServer } from '@/utils/flow'

export class Fetch extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    this.params = this.inputs.params
    const outputs = await super.run()
    this.$state.commit((state: any) => {
      state.client = this.inputs.client
      state.clientServer = proxyClientServer(this.inputs.clientServer, outputs)
      state.type = 'fetch'
      state.com = this.inputs.com
    })
    return outputs
  }
}
