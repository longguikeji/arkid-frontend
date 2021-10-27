import { FunctionNode } from 'arkfbp/lib/functionNode'

export class DataNode extends FunctionNode {
  async run() {
    const { client, com } = this.inputs
    const data = com.state.data
    if (data) {
      client.data = data
    }
  }
}
