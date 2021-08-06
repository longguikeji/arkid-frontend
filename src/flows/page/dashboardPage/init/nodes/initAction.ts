import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class InitAction extends FunctionNode {
  async run() {
    const { state, currentPage, initContent } = this.inputs
    const pageState: AdminComponentState = state[currentPage]
    if (initContent?.init) {
      pageState.state.actions!.fetch = [
        {
          name: 'flows/page/dashboardPage/fetch',
          url: initContent.init.path,
          method: initContent.init.method
        }
      ]
      pageState.state.actions!.created.push('fetch')
    }
  }
}
