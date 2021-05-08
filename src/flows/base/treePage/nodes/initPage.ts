import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: TreePageState = {
      type: 'TreePage',
      state: {
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
    }

    this.$state.commit(state => {
      state.state = tempState
    })

    return {
      data: this.inputs,
      state: tempState.state
    }
  }
}
