import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'

export class DeleteTreeNode extends AuthApiNode {
  async run() {
    const data = this.inputs.com.state.data

    this.url = getUrl(this.inputs.params.deleteUrl, data)
    this.method = this.inputs.params.deleteMethod || 'delete'
    if (!this.url) {
      throw Error('treePage delete flow is not url')
    }

    const outputs = await super.run()
    await runFlowByFile('flows/treePage/fetchTreeNode', this.inputs)
    return outputs
  }
}
