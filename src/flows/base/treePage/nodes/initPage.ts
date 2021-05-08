import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: TreePageState = {
      type: 'TreePage',
      created: 'created',
      tree: {
        header: {
          title: '',
          buttons: []
        },
        nodes: {
          isFilter: true,
          expandOnClickNode: false,
          data: [],
          action: ''
        }
      },
      dialogs: {},
      table: {
        type: 'TablePage'
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
