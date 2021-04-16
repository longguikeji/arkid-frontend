import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: TablePageState = {
      type: 'TablePage',
      pages: [],
      created: [
        {
          'name': 'flows/hookFlow/created'
        }
      ],
      beforeDestroy: [
        {
          'name': 'flows/hookFlow/beforeDestroy'
        }
      ],
      destroyed: [],
      card: {
        title: '',
        buttons: []
      },
      dialogs: {},
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
