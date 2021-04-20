import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/url'
export class Delete extends AuthApiNode {
  async run() {
    const data = this.inputs.com.state.data

    this.url = getUrl(this.inputs.params.url, data)
    this.method = this.inputs.params.method || 'delete'
    if (!this.url) {
      throw Error('tablePgae delete flow url is not valid')
    }
    
    const outputs = await super.run()
    await runFlowByFile('flows/tablePage/fetch', this.inputs)
    return outputs
  }
}
