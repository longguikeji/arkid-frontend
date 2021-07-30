import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class Options extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const options = [
      { value: 'gif' }, { value: 'jpg' }, { value: 'png' }, { value: 'jpeg' }
    ]
    const items = pageState.state.form.items?.data?.state?.items
    if (items?.upload_file_format) items.upload_file_format.state.options = options
  }
}
