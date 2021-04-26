import { FunctionNode } from 'arkfbp/lib/functionNode'
import { setButtonStatus } from '@/utils/btn'
import OpenAPI from '@/config/openapi'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const { data, com } = this.inputs
    state.client.table.data = []

    let len = 0
    if (data.results !== undefined || data.data !== undefined) {
      const res = data.results || data.data
      state.client.table.data = res
      len = res.length
    } else {
      state.client.table.data = data
      len = data.length
    }

    state.client.pagination.total = data.count || len
    
    const buttons = state.client.card?.buttons
    if (len > 0) {
      setButtonStatus(buttons, false)
    } else {
      setButtonStatus(buttons, true)
    }
    
    if (com?.$route?.meta?.page === 'extension') {
      await OpenAPI.instance.init('/api/schema?format=json')
    }

    return this.inputs
  }
}
