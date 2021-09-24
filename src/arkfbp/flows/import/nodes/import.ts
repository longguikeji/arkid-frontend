import { APINode } from '@/arkfbp/nodes/apiNode'
import { FlowModule } from '@/store/modules/flow'
import { error } from '@/constants/error'

export class Import extends APINode {
  async run() {
    const { com, url, method, params } = this.inputs
    const data = params.data
    if (!data || !data.raw) {
      throw Error('import file is empty')
    }
    this.url = url
    this.method = method
    let formData = new FormData()
    formData.append("file", data.raw)
    this.params = formData
    const outputs = await super.run()
    const errorStatus = outputs.error
    if (errorStatus && errorStatus !== '0') {
      FlowModule.stopRunFlow()
      com.$message({
        message: error[errorStatus],
        type: 'error',
        showClose: true
      })
    }
  }
}
