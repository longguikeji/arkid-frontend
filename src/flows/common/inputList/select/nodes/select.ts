import { FunctionNode } from 'arkfbp/lib/functionNode'
import ListItemState from '@/admin/common/data/List/ListState'
import { processUUId } from '@/utils/common'

export class SelectNode extends FunctionNode {
  async run() {
    const { client: state, params } = this.inputs
    const { multiple, field } = params
    const listData: ListItemState[] = state.list.items
    const data = state.table ? state.table.row : state.tree ? state.tree.node : null
    if (!data || !data[field]) return
    const item = {
      label: data.label || data.name || data.username || '',
      value: data[field],
      action: 'delete'
    }
    if (listData.length === 0) {
      listData.push(item)
    } else if (multiple) {
      let isExistThisValue = false
      for (let i = 0, len = listData.length; i < len; i++) {
        const item = listData[i]
        if (processUUId(item.value) === processUUId(data[field])) {
          listData.splice(i, 1)
          isExistThisValue = true
          break
        }
      }
      if (!isExistThisValue) listData.push(item)
    } else {
      listData[0] = item
    }
  }
}