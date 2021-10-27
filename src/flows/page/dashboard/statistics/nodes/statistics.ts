import { FunctionNode } from 'arkfbp/lib/functionNode'

export class StatisticsNode extends FunctionNode {

  async run() {
    const { state, dep, page } = this.inputs
    state[page] = {
      type: 'DashboardPage',
      state: {
        items: [],
        options: {},
        actions: {}
      }
    }
    if (dep && dep.init) {
      const { path, method } = dep.init
      if (path && method) {
        const pageState = state[page].state
        const actions = pageState.actions
        pageState.created = 'created'
        actions.created = [ 'fetch' ]
        actions.fetch = [
          {
            name: 'flows/custom/statistics',
            url: path, method
          }
        ]
      }
    }
  }

}
