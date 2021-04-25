import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class InitAction extends FunctionNode {
  async run() {
    const tempState: DashboardPageState = this.inputs.state
    const initContent = this.inputs.data.initContent
    if (initContent?.init) {
      tempState.created?.push({
        name: 'flows/dashboardPage/fetch',
        params: {
          fetchUrl: initContent.init.path,
          fetchMethod: initContent.init.method,
        }
      })
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
