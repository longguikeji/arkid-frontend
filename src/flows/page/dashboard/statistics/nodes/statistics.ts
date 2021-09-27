import { FunctionNode } from 'arkfbp/lib/functionNode'

export class StatisticsNode extends FunctionNode {

  async run() {
    const { state, page, dep, options } = this.inputs
    state[page] = {
      type: 'DashboardPage',
      state: {
        created: 'created',
        items: [],
        actions: {
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'flows/page/dashboardPage/fetch',
              url: dep.init.path,
              method: dep.init.method
            }
          ]
        },
        card: {
          title: options.description
        }
      }
    }
  }

}