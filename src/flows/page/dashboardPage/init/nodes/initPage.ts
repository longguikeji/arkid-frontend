import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitPage extends FunctionNode {
  async run() {
    const { state, currentPage } = this.inputs
    state[currentPage] = {
      type: 'DashboardPage',
      state: {
        name: currentPage,
        created: 'created',
        items: [],
        actions: {
          created: []
        }
      }
    }
    return this.inputs
  }
}
