import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitTreePage extends FunctionNode {
  async run() {
    const tempState: TreePageState = {
      created: [],
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
      table: {}
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
