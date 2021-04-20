import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class Export extends AuthApiNode {

  getHeaders() {
    return {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }

  async run() {
    const tempState = this.getState()
    const data = tempState.table.data || tempState.table.table.data

    if (data.length === 0 || data === undefined) {
      this.inputs.com.$message({
        message: '当前没有数据可以导出',
        showClose: true
      })
      return null
    }

    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method

    const outputs = await super.run()
    
    // let blob = new Blob([outputs], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml' })
    let blob = new Blob([outputs], { type: 'application/vnd.ms-excel,charset=utf-8' })
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let urlName = this.url.split('/')
    const fileName = urlName[urlName.length - 2] + '_' + new Date().toLocaleDateString() + '.xls'
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  }
}
