import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { firstArrContainSecondArr, getObjAllKeys } from '@/utils/common'
import { FlowModule } from '@/store/modules/flow'
import { error } from '@/constants/error'
import { isArray } from '@/utils/common'

export class Update extends AuthApiNode {
  async run() {
    const { url, method, params, com, required } = this.inputs
    this.url = url
    this.method = method
    this.params = params

    // 进行必填字段的统一判断
    let isNotLackRequiredParams = true
    // if (required) {
    //   if (!isArray(required)) {
    //     const mainKey = Object.keys(required)[0]
    //     const mainValue = this.params[mainKey]
    //     const mainRequired = required[mainKey][mainValue]
    //   }
    //   const paramKeys = getObjAllKeys(this.params)
    //   isNotLackRequiredParams = firstArrContainSecondArr(paramKeys, required)
    // }

    // 判断是否
    if (!isNotLackRequiredParams) {
      FlowModule.stopRunFlow()
      com.$message({
        message: '缺少必填字段',
        type: 'error',
        showClose: true
      })
      return null
    }

    const outputs = await super.run()

    if (outputs.error) {
      FlowModule.stopRunFlow()
      com.$message({
        message: error[outputs.error],
        type: 'error',
        showClose: true
      })
    }

    return outputs
  }
}
