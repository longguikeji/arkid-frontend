import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class InitInputList extends FunctionNode {
  async run() {
    const { client: state, com } = this.inputs
    await runFlowByFile('flows/initPage', {
      page: com.state.page,
    }).then((res) => {
      this.initInputListDialog(res, com, state.name)
      res.state.list = state.dialogs!.inputList.state.state.list
      res.state.list.data = []
      state.dialogs!.inputList.state = res
      state.dialogs.inputList.visible = true
    })
  }
  
  initInputListDialog(pageState: AdminComponentState, com: any, name: string) {
    const path = com.path
    const { multiple, field } = com.state
    const { state, type } = pageState
    state.actions.confirm = [
      {
        name: 'flows/list/confirm',
        path: path,
        request: {
          multiple,
          field
        }
      },
      `${name}.closeInputList`
    ]
    state.actions.clicked = [
      {
        name: 'flows/list/clicked',
        request: {
          multiple,
          type,
          field
        }
      }
    ]
    switch (type) {
      case 'TablePage':
        state.table.selection = {
          exist: multiple,
          values: []
        }
        state.table.selectAction = 'clicked'
        break
      case 'TreePage':
        state.tree.action = 'clicked'
    }
  }
}