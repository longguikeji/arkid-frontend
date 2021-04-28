import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const isHooks = this.inputs.isHooks
    const tempState: TablePageState = {
      type: 'TablePage',
      pages: [],
      created: isHooks === false ? undefined : 'created',
      beforeDestroy: isHooks === false ? undefined : 'beforeDestroy',
      destroyed: isHooks === false ? undefined : 'destroyed',
      card: {
        title: '',
        buttons: []
      },
      filter: {},
      dialogs: {},
      table: {
        columns: [],
        data: [],
        selection: {}
      },
      actions: {
        created: [
          {
            name: 'arkfbp/flows/hookFlow/created'
          }
        ],
        beforeDestroy: [
          {
            'name': 'arkfbp/flows/hookFlow/beforeDestroy'
          }
        ]
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
