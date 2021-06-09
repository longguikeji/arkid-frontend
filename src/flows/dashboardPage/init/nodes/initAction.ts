import { FunctionNode } from 'arkfbp/lib/functionNode'
import { DashboardPage } from '@/admin/DashboardPage/DashboardPageState'

export class InitAction extends FunctionNode {
  async run() {
    const tempState: DashboardPage = this.inputs.state
    const initContent = this.inputs.data.initContent
    if (initContent?.init) {
      tempState.actions!.fetch = [
        {
          name: 'flows/dashboardPage/fetch',
          url: initContent.init.path,
          method: initContent.init.method
        }
      ]
      tempState.actions!.created.push('fetch')
    }

    const { state } = this.$state.fetch()

    return {
      data: this.inputs,
      state: state
    }
  }
}
