import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: DashboardPageState = {
      type: 'DashboardPage',
      created: 'created',
      items: [],
      actions: {
        created: []
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
