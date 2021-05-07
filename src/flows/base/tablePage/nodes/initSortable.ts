import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitSortable extends FunctionNode {
  async run() {
    const tempState = this.inputs.state as TablePageState
    const initContent = this.inputs.data.initContent
    if (initContent.sort) {
      // 给 table 表格项添加一项 <排序>
      const columnSort = {
        prop: 'sort',
        label: '排序',
        scope: {
          type: 'Sort',
          state: new Array(),
        }
      }
      // 判断有什么类型的排序
      Object.keys(initContent.sort).forEach((sortName) => {
        const url = initContent.sort[sortName].path
        const method = initContent.sort[sortName].method
        const actionName = 'sortBy' + sortName
        tempState.actions![actionName] = [
          {
            name: 'arkfbp/flows/sort',
            url: url,
            method: method
          },
          'fetch'
        ]
        if (sortName !== 'batch') {
          columnSort.scope.state.push({
            type: sortName,
            action: actionName
          })
        } else {
          tempState.table!.sortable = true
          tempState.table!.sortAction = actionName
          tempState.actions![actionName][0]['request'] = {
            idps: {
              key: 'uuid',
              data: 'table.data'
            }
          }
        }
      })
      // 将 columnSort 添加给 table
      tempState.table?.columns?.push(columnSort)
    }
    
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
