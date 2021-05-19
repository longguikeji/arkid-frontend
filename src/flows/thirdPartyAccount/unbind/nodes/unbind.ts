import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Unbind extends AuthApiNode {
  async run() {
    const data = this.inputs.com.state.data
    this.url = data.unbind
    this.method = 'GET'
    await super.run()
  }
}
