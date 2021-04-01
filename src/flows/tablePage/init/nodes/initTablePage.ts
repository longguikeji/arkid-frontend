import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitTablePage extends FunctionNode {
  async run() {
    const tempState: TablePageState = {
      pages: [],
      created: [
        {
          'name': 'flows/hookFlow/created'
        }
      ],
      beforeDestroy: [
        {
          'name': 'flows/hookFlow/beforeDestory'
        }
      ],
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
