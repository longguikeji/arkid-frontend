import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: TablePageState = {
      type: 'TablePage',
      state: {
        created: 'created',
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
