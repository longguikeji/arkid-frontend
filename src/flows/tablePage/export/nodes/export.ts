import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class Export extends AuthApiNode {

  async run() {
    const tempState = this.getState()
    const data = tempState.table.selection?.values || tempState.table.table.selection?.values

    if (data.length === 0 || data === undefined) {
      this.inputs.com.$message({
        message: '请先选择需要导出的数据',
        type: 'warning'
      })
      return null
    }

    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method
    this.params = data

    const outputs = await super.run()

    const link = document.createElement('a')
    let blob = new Blob([outputs], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let urlName = this.url.split('/')
    const fileName = urlName[urlName.length - 2] + '_' + new Date().getTime().toString() + '.xlsx'
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return outputs
  }
  
}
