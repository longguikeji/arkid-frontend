import { FunctionNode } from 'arkfbp/lib/functionNode'
import authPage from '@/config/auth/auth_page.json'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class AuthPageBtn extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const columns = pageState.state.table?.columns
    columns[columns.length - 1]?.scope?.state?.push({
      label: '配置授权页面',
      type: 'info',
      action: 'openAuthPage'
    })
    pageState.state.actions!.openAuthDialog = [
      {
        name: 'arkfbp/flows/cancelValidate'
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.auth.visible': true
        }
      }
    ]
    pageState.state.actions!.closeAuthDialog = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.auth.visible': false
        }
      }
    ]
    pageState.state.dialogs.auth = {
      visible: false,
      page: 'app.auth'
    }
    state['app.auth'] = authPage
  }
}
