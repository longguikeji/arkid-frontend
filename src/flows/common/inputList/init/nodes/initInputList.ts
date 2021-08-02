import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { AdminModule } from '@/store/modules/admin'

export class InitInputList extends FunctionNode {
  async run() {
    const { client: state, com } = this.inputs
    const { page, multiple, field, parent, value, options } = com.state
    const pageState: AdminComponentState = AdminModule.adminState[page]
    const type = pageState.type
    pageState.state.actions.confirm = [
      {
        name: 'flows/common/inputList/confirm',
        path: com.path,
        request: {
          multiple, field
        }
      },
      `${parent}.close${page}`
    ]
    pageState.state.actions.clicked = [
      {
        name: 'flows/common/inputList/clicked',
        request: {
          multiple,
          type,
          field
        }
      }
    ]
    pageState.state.list.data.length = 0
    for (const item of options) {
      pageState.state.list.data.push(item)
    }
    switch(type) {
      case 'TablePage':
        if (!pageState.state.table.selection?.values?.length) {
          pageState.state.table.selection = {
            exist: multiple,
            values: []
          }
        }
        pageState.state.table.selectAction = 'clicked'
        break
      case 'TreePage':
        pageState.state.tree.checkAction = 'clicked'
        pageState.state.tree.multiple = multiple
    }
    state.dialogs[page].visible = true
  }
}