import { APINode } from '@/arkfbp/nodes/apiNode'
import { FlowModule } from '@/store/modules/flow'
import { error } from '@/constants/error'
import { isArray } from '@/utils/common'
import { isLackRequiredParams } from '@/utils/flow'

export class Update extends APINode {
  async run() {
    const { url, method, params, com, required } = this.inputs
    this.url = url
    this.method = method
    this.params = params

    let lackRequiredParams = false
    if (required) {
      let requiredSet = required
      if (!isArray(required)) {
        const mainKey = Object.keys(required)[0]
        const mainValue = this.params[mainKey]
        requiredSet = required[mainKey][mainValue]
      }
      lackRequiredParams = isLackRequiredParams(this.params, requiredSet)
    }
    if (lackRequiredParams) {
      FlowModule.stopRunFlow()
      com.$message({
        message: '缺少必填字段',
        type: 'error',
        showClose: true
      })
      return null
    }

    const outputs = await super.run()
    if (outputs && outputs.error !== '0') {
      FlowModule.stopRunFlow()
      com.$message({
        message: error[outputs.error]  || outputs.message || 'Error',
        type: 'error',
        showClose: true
      })
    }
    return outputs
  }
}