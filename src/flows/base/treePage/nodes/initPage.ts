import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: TreePageState = {
      type: 'TreePage',
      pages: [],
      created: 'created',
      beforeDestroy: 'beforeDestroy',
      destroyed: '',
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
