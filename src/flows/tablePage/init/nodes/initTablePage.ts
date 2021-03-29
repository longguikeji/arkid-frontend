import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitTablePage extends FunctionNode {
  async run() {
    const tempState: TablePageState = {
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
      data: this.inputs,
      state: tempState
    }
  }
}
