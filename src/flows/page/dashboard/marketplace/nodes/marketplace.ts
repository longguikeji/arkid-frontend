import { FunctionNode } from 'arkfbp/lib/functionNode'
// import { upperFirst } from 'lodash'

export class Marketplace extends FunctionNode {
  async run() {
    const { state, page, dep, options } = this.inputs
    const { init, local } = dep
    state[page] = {
      type: 'DashboardPage',
      state: {
        created: 'created',
        options: {
          disabled: true,
        },
        card: {
          title: options.description
        },
        items: [],
        actions: {
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'flows/custom/marketplace',
              url: init.path,
              method: init.method,
            }
          ]
        }
      }
    }
  }
}