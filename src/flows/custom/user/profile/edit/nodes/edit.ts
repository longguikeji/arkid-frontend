import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ConfigModule } from '@/store/modules/config'

export class ControlEditFieldsNode extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state
    const items = pageState.form.items
    const editFields = ConfigModule.user.isEditFields
    if (items && editFields) {
      for (const key in items) {
        if (editFields?.indexOf(key) < 0) {
          const item = items[key]
          item.state.disabled = true
        }
      }
    }
  }

}