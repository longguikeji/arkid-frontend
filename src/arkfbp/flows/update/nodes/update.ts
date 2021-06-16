import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { firstArrContainSecondArr, getObjAllKeys } from '@/utils/common'
import { FlowModule } from '@/store/modules/flow'

export class Update extends AuthApiNode {
  async run() {
    const { url, method, params, com, required } = this.inputs
    this.url = url
    this.method = method
    this.params = params

    // 进行必填字段的统一判断
    const route = com.$route
    if (required?.length && route.name !== 'group') {
      const paramKeys = getObjAllKeys(this.params)
      const isPass = firstArrContainSecondArr(paramKeys, required)
      if (!isPass) {
        FlowModule.stopRunFlow()
        com.$message({
          message: '缺少必填字段',
          type: 'error',
          showClose: true
        })
        return null
      }
    }

    const outputs = await super.run()
    return outputs
  }
}
