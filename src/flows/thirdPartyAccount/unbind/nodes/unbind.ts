import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'

export class Unbind extends AuthApiNode {
  async run() {
    this.url = this.inputs.params.url
    this.method = this.inputs.params.method
    await super.run().then(async () => {
      await runFlowByFile('flows/thirdPartyAccount/fetch', this.inputs)
    })
  }
}
