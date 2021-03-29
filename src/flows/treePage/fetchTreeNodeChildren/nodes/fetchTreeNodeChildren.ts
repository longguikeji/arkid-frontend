import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'
import TreePageState from '@/admin/TreePage/TreePageState'
import TreeNodeProps from '@/admin/common/data/Tree/TreeNodeProps'
import getTreeData from '@/utils/get-tree-data'

export class FetchTreeNodeChildren extends TokenAPINode {
  async run() {
    const tempState: TreePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    const data = this.inputs.params.data as TreeNodeProps

    this.url = getUrl(this.inputs.params.fetchUrl, data)
    this.method = this.inputs.params.fetchMethod || 'get'
    this.$state.commit((state: any) => {
      state.client = tempState
    })

    const outputs = await super.run()

    data.children = getTreeData(outputs.results)

    return {
      data: outputs,
      params: this.inputs.params,
      com: this.inputs.com
    }
  }
}
