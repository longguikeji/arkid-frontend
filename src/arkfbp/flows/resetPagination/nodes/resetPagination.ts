import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ResetPaginationNode extends FunctionNode {
  async run() {
    const { client } = this.inputs
    client.pagination.currentPage = 1
  }
}
