import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeEditFieldsUpdateStateNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state
    pageState.table.selection = {
      values: [],
      default: []
    }
    const columns = pageState.table.columns
    columns.forEach(column => {
      if (column?.prop === 'is_select') {
        column.hidden = true
      }
    })

    // actions
    const actions = pageState.actions
    if (!actions.fetch) actions.fetch = []
    actions.fetch.push({
      name: 'flows/custom/editfields/selection'
    })
    const updateAction = actions.update[1]
    if (updateAction) {
      updateAction.name = 'flows/custom/editfields/update'
    }
  }
}
