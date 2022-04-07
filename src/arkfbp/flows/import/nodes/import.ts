import { APINode } from '@/arkfbp/nodes/apiNode'
import { error } from '@/constants/error'

export class Import extends APINode {
  async run() {
    const { com, url, method, params } = this.inputs
    const data = params.data
    if (!data) return
    this.url = url
    this.method = method
    let formData = new FormData()
    formData.append('file', data)
    this.params = formData
    const outputs = await super.run()
    const errorStatus = outputs.error
    if (errorStatus && errorStatus !== '0') {
      com.$message({
        message: error[errorStatus],
        type: 'error',
        showClose: true,
      })
    }
  }
}
