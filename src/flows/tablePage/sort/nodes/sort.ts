import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import TablePageState from '@/admin/TablePage/TablePageState'

export class Sort extends AuthApiNode {
  async run() {
    const tempState: TablePageState = this.getState()
    const data = tempState.table?.data 
    const sortType = this.inputs.params.sortType
    const rowState = this.inputs.com.state
    
    let targetData
    if (sortType !== 'batch') {
      rowState.forEach(item => {
        if (item.type === sortType) targetData = item.data
      })
    }

    this.url = getUrl(this.inputs.params.sortUrl, targetData)
    this.method = this.inputs.params.sortMethod || 'post'
    if (!this.url) {
      throw Error('tablePage sort flow is not url')
    }
    
    if (sortType === 'batch') {
      this.params = {
        idps: []
      }
      if (data) {
        data.forEach(row => {
          this.params.idps.push(row.uuid)
        })
      }
    }
    
    const outputs = await super.run()
    await runFlowByFile('flows/tablePage/fetch', this.inputs)
    return outputs
  }
}
