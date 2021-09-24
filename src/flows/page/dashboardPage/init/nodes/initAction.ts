import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitAction extends FunctionNode {
  async run() {
    const { state, page, dep } = this.inputs
    const pageState = state[page].state
    if (dep?.init) {
      pageState.actions.fetch = [
        {
          name: 'flows/page/dashboardPage/fetch',
          url: dep.init.path,
          method: dep.init.method
        }
      ]
      pageState.actions.created.push('fetch')
    }
  }
}
