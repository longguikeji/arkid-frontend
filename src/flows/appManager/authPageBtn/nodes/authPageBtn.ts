import { FunctionNode } from 'arkfbp/lib/functionNode'

export class AuthPageBtn extends FunctionNode {
  async run() {
    const tempState = this.inputs.state.state
    const authPageBtn = {
      label: '配置授权页面',
      type: 'info',
      action: 'openAuthPage'
    }
    tempState.table?.columns[tempState.table.columns.length - 1]?.scope?.state?.push(authPageBtn)
    tempState.actions!['openAuthPage'] = [
      {
        name: 'flows/appManager/openAuthPage'
      }
    ]
  }
}
