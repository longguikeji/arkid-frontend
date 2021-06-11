import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: DashboardPageState = {
      type: 'DashboardPage',
      state: {
        created: 'created',
        items: [],
        actions: {
          created: []
        }
      }
    }

    this.$state.commit(state => {
      state.state = tempState
    })

    return {
      data: this.inputs,
      state: tempState.state
    }
  }
}
