import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/get-url'
import TreePageState from '@/admin/TreePage/TreePageState'
import TreeNodeProps from '@/admin/common/data/Tree/TreeNodeProps'
import getTreeData from '@/utils/get-tree-data'
import { runFlowByFile } from '@/arkfbp/index'

export class FetchTreeNodeChildren extends AuthApiNode {
  async run() {
    const tempState: TreePageState = this.getState()
    const data = this.inputs.params.data as TreeNodeProps

    this.url = getUrl(this.inputs.params.fetchUrl, data)
    this.method = this.inputs.params.fetchMethod || 'get'
    this.$state.commit((state: any) => {
      state.client = tempState
    })

    const outputs = await super.run()

    data.children = getTreeData(outputs.results)

    // 在这里进行拦截，如果目前弹出的页面中没有table选项，则跳过此流
    if (!tempState.table) {
      return
    }

    // 获取当前组中的用户内容
    await runFlowByFile('flows/treePage/fetchTableList', this.inputs) 
  }
}
