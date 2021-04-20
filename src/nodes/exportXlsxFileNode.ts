import { AuthApiNode } from '@/nodes/authApiNode'
import axios, { Method } from 'axios'

export class ExportXlsxFileNode extends AuthApiNode {

  getHeaders() {
    return {
      'Content-Type': 'application/octet-stream'
    }
  }

  async run() {
    await axios({
      url: this.url,
      method: this.method as Method,
      headers: this.headers,
      responseType: 'arraybuffer',
    }).then((response) => {
      const data = response.data
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      const fileName = new Date().toLocaleDateString().replace(/\//g, '-') + '.xlsx'
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
    })
  }
}
