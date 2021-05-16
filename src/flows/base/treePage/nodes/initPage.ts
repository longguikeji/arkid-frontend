import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: TreePageState = {
      type: 'TreePage',
      state: {
        created: 'created',
        card: {
          title: '',
          buttons: []
        },
        tree: {
          isFilter: true,
          expandOnClickNode: false,
          data: [],
          action: ''
        },
        dialogs: {},
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
