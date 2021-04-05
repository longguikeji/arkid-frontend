import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitTreePage extends FunctionNode {
  async run() {
    const tempState: TreePageState = {
      type: 'TreePage',
      pages: [],
      created: [
        {
          name: 'flows/hookFlow/created'
        }
      ],
      beforeDestroy: [
        {
          'name': 'flows/hookFlow/beforeDestroy'
        }
      ],
      destroyed: [],
      tree: {
        header: {
          title: '',
          buttons: []
        },
        nodes: {
          isFilter: true,
          expandOnClickNode: false,
          data: [],
          action: []
        }
      },
      dialogs: {},
      table: {
        type: 'TablePage'
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
