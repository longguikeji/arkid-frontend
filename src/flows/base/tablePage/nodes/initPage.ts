import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const isHooks = this.inputs.isHooks
    const tempState: TablePageState = {
      type: 'TablePage',
      created: isHooks === false ? undefined : 'created',
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
        created: []
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
