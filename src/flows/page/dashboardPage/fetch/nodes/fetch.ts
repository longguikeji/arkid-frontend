import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Fetch extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    const outputs = await super.run()
    this.$state.commit(state => {
      state.client = this.inputs.client
      state.results = outputs.results
    })
  }
}
