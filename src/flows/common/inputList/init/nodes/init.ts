import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitInputList extends FunctionNode {
  async run() {
    // input list base info
    const { client: state, com } = this.inputs
    const { page, multiple, field, parent, value, options } = com.state
    const pageState = com.getAnyPageState(page)
    const type = pageState.tree ? 'TreePage' : 'TablePage'

    // add action
    Object.assign(pageState.actions, {
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
    if (!pageState.list) {
      pageState.list = {
        title: '已选数据列表',
        buttons: [
          {
            label: '确认所选',
            type: 'primary',
            action: 'confirm',
            size: 'mini'
          }
        ],
        items: [],
        isActive: true,
        disabled: true,
        clearable: true
      }
    }
    const items = pageState.list.items
    // set list inital data
    items.length = 0
    for (let item of options) {
      items.push(item)
    }
    // set table or tree default data and execute action
    // can process multiple => extend content ...
    switch(type) {
      case 'TablePage':
        pageState.table.rowClickAction = 'select'
        break
      case 'TreePage':
        pageState.tree.nodeClickAction = 'select'
    }
    // open dialog => inputList page
    state.dialogs[page].visible = true
  }
}