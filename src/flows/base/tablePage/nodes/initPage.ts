import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const isHooks = this.inputs.isHooks
    const tempState = {
      type: 'TablePage',
      pages: [],
      created: isHooks === false ? '' : 'created',
      beforeDestroy: isHooks === false ? '' : 'beforeDestroy',
      destroyed: [],
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
            name: 'flows/hookFlow/created'
          }
        ],
        beforeDestroy: [
          {
            'name': 'flows/hookFlow/beforeDestroy'
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
