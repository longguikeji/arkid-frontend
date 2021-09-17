import { APINode } from '@/arkfbp/nodes/apiNode'

export class CsvNode extends APINode {

  private _csvHeaders = {
    'Content-Type': 'application/octet-stream'
  }

  private _reposneType = 'arraybuffer'

  async run() {
    this.headers = this._csvHeaders
    this.responseType = this._reposneType
    const data = await super.run()
    if (data) {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      const fileName = new Date().toLocaleDateString().replace(/\//g, '-') + '.csv'
      if ('download' in document.createElement('a')) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        navigator.msSaveBlob(blob, fileName)
      }
    }
  }

}