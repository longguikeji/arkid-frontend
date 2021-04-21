import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const isHooks = this.inputs.isHooks
    const tempState: TablePageState = {
      type: 'TablePage',
      pages: [],
      created: isHooks === false ? [] : [
        {
          'name': 'flows/hookFlow/created'
        }
      ],
      beforeDestroy: isHooks === false ? [] : [
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
        data: [],
        selection: {}
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
