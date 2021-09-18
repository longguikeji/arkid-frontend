import { FunctionNode } from 'arkfbp/lib/functionNode'
import { FlowModule } from '@/store/modules/flow'

export class NextNode extends FunctionNode {
  async run() {
    const { url, previous } = this.inputs
    if (previous.uuid) {
      const param = url.substring(url.lastIndexOf('{'), url.lastIndexOf('}') + 1)
      this.inputs.url = url.replace(param, previous.uuid)
      return this.inputs
    } else {
      FlowModule.stopRunFlow()
    }
  }
}
