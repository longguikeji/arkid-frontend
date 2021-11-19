import { APINode } from '@/arkfbp/nodes/apiNode'

export class Install extends APINode {
  async run() {
    const { com, url, method } = this.inputs
    const data = com.state.data
    this.params = {
      type: data.name
    }
    this.url = url
    this.method = method
    await super.run().then(() => {
      com.$message({
        message: '安装成功',
        type: 'success',
        showClose: true,
      })
    })
  }
}