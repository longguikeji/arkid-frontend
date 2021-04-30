import { AuthApiNode } from '@/nodes/authApiNode'
import { proxyClientServer } from '@/utils/flow'
import getTreeData from '@/utils/get-tree-data'

export class Fetch extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    this.params = this.inputs.params
    const outputs = await super.run()
    this.$state.commit((state: any) => {
      state.client = this.inputs.client
      state.clientServer = proxyClientServer(this.inputs.clientServer, outputs)
    })
    const clientServerKey = Object.keys(this.inputs.clientServer)[0]
    if (this.inputs.com.$route.meta.page === 'group' && clientServerKey.includes('tree.nodes')) {
      const treeResults = getTreeData(outputs.results)
      return treeResults
    } else {
      return outputs
    }
  }
}
