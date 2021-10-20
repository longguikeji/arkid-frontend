import { FunctionNode } from 'arkfbp/lib/functionNode'

export class TreeNodeNode extends FunctionNode {
  async run() {
    const { client, com } = this.inputs
    const node = com.state.node
    client.data = node
  }
}
