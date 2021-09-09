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
        },
        card: {
          title: '应用市集'
        }
      }
    }
    state['notice'] = {
      type: 'TablePage',
      state: {
        name: 'notice',
        table: {
          data: [],
          columns: []
        },
        card: {
          title: '通知列表',
          items: []
        }
      }
    }
    return this.inputs
  }
}
