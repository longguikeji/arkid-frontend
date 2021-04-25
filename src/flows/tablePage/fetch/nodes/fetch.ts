import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'
import TablePageState from '@/admin/TablePage/TablePageState'

export class Fetch extends AuthApiNode {

  getFilterParams(state: TablePageState) {
    const filterParams = {}
    if (this.inputs.params?.isFilter && state.filter?.items) {
      const items = state.filter?.items
      Object.keys(items).forEach(key => {
        if (key !== 'action') {
          let value = items[key].state.value
          // 判断为 string 还是 array
          if (typeof value !== 'string') {
            value = value.join(',')
          }
          filterParams[key] = value
        }
      })
    }
    return filterParams
  }

  async run() {
    const tempState: TablePageState = this.getState()
    
    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = (this.inputs.params.fetchMethod as string).toUpperCase() || 'GET'
    
    this.params = {
      page: tempState.pagination?.currentPage || 1,
      page_size: tempState.pagination?.pageSize || 10,
      ...this.getFilterParams(tempState)
    }

    this.$state.commit((state: any) => {
      state.client = tempState
    })
    const outputs = await super.run()
    return {
      data: outputs,
      com: this.inputs.com
    }
  }
}
