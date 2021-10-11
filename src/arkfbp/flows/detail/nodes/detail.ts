import { FunctionNode } from 'arkfbp/lib/functionNode'
import { DescriptionsItemsState, DescriptionsItemState, DescriptionsObjectItemsState } from '@/admin/common/Descriptions/DescriptionsState'

export class Detail extends FunctionNode {
  async run() {
    const { client: state, com } = this.inputs
    const row = com.state.row
    const items = state.dialogs.detail.state.state.items
    if (items && row) {
      this.setItems(items, row)
    }
  }

  setItems(items: DescriptionsItemsState, data: any) {
    Object.keys(data).forEach(key => {
      const value = data[key]
      if (typeof value === 'string') {
        if (items[key]) {
          (items[key] as DescriptionsItemState).value = value
        } else {
          items[key] = {
            label: key,
            value: value
          }
        }
      } else if (typeof value === 'object' && items[key]) {
        items[key].label = key
        const objectItems = (items[key] as DescriptionsObjectItemsState).items
        if (objectItems) {
          this.setItems(objectItems, value)
        }
      }
    })
  }
}
