import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class InitAction extends FunctionNode {
  async run() {
    const tempState: DashboardPageState = this.inputs.state
    const initContent = this.inputs.data.initContent
    if (initContent?.init) {
      tempState.actions!.fetch = [
        {
          name: 'flows/base/dashboardPage/fetch',
          url: initContent.init.path,
          method: initContent.init.method
        }
      ]
      tempState.actions!.created.push('fetch')
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
