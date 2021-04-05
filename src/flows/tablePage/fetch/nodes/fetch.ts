import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/get-url'

export class Fetch extends AuthApiNode {
  async run() {
    debugger
    const tempState = this.getState()
    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = this.inputs.params.fetchMethod || 'get'
    this.params = {
      page: tempState.pagination.currentPage || 1,
      page_size: tempState.pagination.pageSize || 10
    }

    this.$state.commit((state: any) => {
      state.client = tempState
    })
    const outputs = await super.run()
    console.log(outputs)
    return outputs
  }
}
