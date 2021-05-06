import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: DashboardPageState = {
      type: 'DashboardPage',
      pages: [],
      created: 'created',
      beforeDestroy: 'beforeDestroy',
      destroyed: '',
      items: [],
      actions: {
        created: [
          {
            name: 'arkfbp/flows/hookFlow/created'
          }
        ],
        beforeDestroy: [
          {
            'name': 'arkfbp/flows/hookFlow/beforeDestroy'
          }
        ]
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}