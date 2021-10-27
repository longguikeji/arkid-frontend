import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { AdminModule } from '@/store/modules/admin'

export class InitInputList extends FunctionNode {
  async run() {
    const { client: state, com } = this.inputs
    const { page, multiple, field, parent, value, options } = com.state
    const pageState: AdminComponentState = AdminModule.adminState![page]
    const type = pageState.type
    // add action
    Object.assign(pageState.state.actions, {
      confirm: [
        {
          name: 'flows/common/inputList/confirm',
          path: com.path,
          request: {
            multiple,
            field
          }
        },
        `${parent}.close${page}`
      ],
      select: [
        {
          name: 'flows/common/inputList/select',
          request: {
            multiple,
            field
          }
        }
      ]
    })
    const items = pageState.state.list.items
    // set list inital data
    items.length = 0
    for (let item of options) {
      items.push(item)
    }
    // set table or tree default data and execute action
    // can process multiple => extend content ...
    switch(type) {
      case 'TablePage':
        pageState.state.table.rowClickAction = 'select'
        break
      case 'TreePage':
        pageState.state.tree.nodeClickAction = 'select'
    }
    // open dialog => inputList page
    state.dialogs[page].visible = true
  }
}