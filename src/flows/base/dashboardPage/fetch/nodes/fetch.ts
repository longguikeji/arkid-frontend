import { AuthApiNode } from '@/nodes/authApiNode'

export class Fetch extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method

    this.$state.commit((state: any) => {
      state.client = this.inputs.client
      state.com = this.inputs.com
    })
    const outputs = await super.run()
    return outputs
  }
}
