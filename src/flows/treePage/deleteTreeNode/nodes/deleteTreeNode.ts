import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'

export class Delete extends TokenAPINode {
  async run() {
    const data = this.inputs.com.state.data
    if (!data || !data.id) {
      throw Error('the data you are deleting colud not be found')
    }

    this.url = getUrl(this.inputs.params.deleteUrl, data)
    this.method = this.inputs.params.deleteMethod || 'delete'
    if (!this.url) {
      throw Error('delete flow is not url')
    }

    const outputs = await super.run()
    await runFlowByFile('flows/treePage/fetchTreeNode', this.inputs)
    return outputs
  }
}
