import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitPage extends FunctionNode {
  async run() {
    const isHooks = this.inputs.isHooks
    const tempState: TablePageState = {
      type: 'TablePage',
      state: {
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
