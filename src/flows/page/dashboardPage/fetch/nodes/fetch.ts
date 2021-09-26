import { APINode } from '@/arkfbp/nodes/apiNode'

export class Fetch extends APINode {
  async run() {
    const { url, method, page, client } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    this.$state.commit(state => {
      state.client = client
      state.results = outputs.results
      state.outputs = outputs
      state.page = page
    })
    return this.inputs
  }
}
