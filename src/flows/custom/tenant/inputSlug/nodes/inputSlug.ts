import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TenantModule } from '@/store/modules/tenant'
import { FlowModule } from '@/store/modules/flow'

export class InputSlug extends FunctionNode {
  async run() {
    const inputSlugValue = this.inputs.params.slug
    const slug = TenantModule.currentTenant.slug
    if (slug !== inputSlugValue) {
      FlowModule.stopRunFlow()
      this.inputs.com.$message({
        message: '输入短连接标识与当前短连接标识不一致',
        type: 'error',
        showClose: true
      })
    }
  }
}
