import { APINode } from '@/arkfbp/nodes/apiNode'

export class Fetch extends APINode {
  async run() {
    const { url, method, params } = this.inputs
    this.url = url
    this.method = method
    this.params = params
    const outputs = await super.run()
    this.$state.commit((state: any) => {
      state.inputs = this.inputs
    })
    return outputs
  }
}
