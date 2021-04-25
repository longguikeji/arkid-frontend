import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: DashboardPageState = {
      type: 'DashboardPage',
      pages: [],
      created: [
        {
          'name': 'flows/hookFlow/created'
        }
      ],
      beforeDestroy: [
        {
          'name': 'flows/hookFlow/beforeDestroy'
        }
      ],
      destroyed: [],
      items: []
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
