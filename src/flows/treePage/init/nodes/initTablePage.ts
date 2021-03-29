import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitTablePage extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    tempState.table = { 
      created: [],
      card: {
        title: '',
        buttons: []
      },
      dialogs: {
        create: {},
        update: {}
      },
      table: {
        columns: [],
        data: []
      }
    }
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
