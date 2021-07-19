import { FunctionNode } from 'arkfbp/lib/functionNode'
import ListItemState from '@/admin/common/data/List/ListState'

export class Clicked extends FunctionNode {

  addOrCancelListItem(listItems, currentClickedData) {
    if (listItems.length === 0) return -1
    let index = -1
    listItems.forEach((listItem, listIndex) => {
      if (listItem.value === currentClickedData.value) {
        index = listIndex
      }
    })
    return index
  }

  async run() {
    const { client: state, params, com } = this.inputs
    const $state = com.state
    const data = $state.selectedData || $state.selection.values
    const treeNodeActionType = $state.actionType
    if (treeNodeActionType === "expand") return 

    let currentClickedData
    if (params.type === 'TreePage') {
      currentClickedData = {}
      currentClickedData['value'] = data.uuid
      currentClickedData['label'] = data.label || data.name || ''
    } else {
      currentClickedData = []
      if (data.length > 0) {
        data.forEach(idata => {
          currentClickedData.push({
            value: idata.uuid,
            label: idata.label || idata.name || '',
          })
        })
      }
    }
    
    let listData: Array<ListItemState> = state.list.data
    if (params.multiple) {
      if (currentClickedData instanceof Array) {
        if (currentClickedData.length > 0) {
          listData.length = 0
          currentClickedData.forEach((item) => {
            listData.push(item)
          })
        } else {
          listData = listData.splice(0, listData.length)
        }
      } else {
        if (listData.length === 0) {
          listData.push(currentClickedData)
        } else {
          const isExistIndex = this.addOrCancelListItem(listData, currentClickedData)
          isExistIndex === -1 ? listData.push(currentClickedData) : listData.splice(isExistIndex, 1)
        }
      }
    } else {
      const isExistIndex = this.addOrCancelListItem(listData, currentClickedData)
      if (isExistIndex === -1 || isExistIndex === undefined) {
        listData.splice(0, listData.length)
        listData.push(currentClickedData) 
      } else {
        listData.splice(0, listData.length)
      }
    }
  }
}
