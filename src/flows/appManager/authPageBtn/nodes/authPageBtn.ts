import { FunctionNode } from 'arkfbp/lib/functionNode'

export class AuthPageBtn extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    debugger
    // button
    const authPageBtn = {
      label: '配置授权页面',
      type: 'info',
      action: [
        {
          name: 'flows/appManager/openAuthPage'
        }
      ]
    }
    tempState.table?.columns[tempState.table.columns.length - 1]?.scope?.state?.push(authPageBtn)
    return {
      state: tempState
    }
  }
}
