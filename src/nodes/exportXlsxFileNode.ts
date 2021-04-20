import { APINode } from "arkfbp/lib/apiNode"
import { getToken } from '@/utils/auth'
import axios, { Method } from 'axios'

export class ExportXlsxFileNode extends APINode {

  getHeaders() {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/octet-stream'
    }
    if (token) {
      headers['Authorization'] = 'Token ' + token
    }
    return headers
  }

  async run() {
    await axios({
      url: this.url,
      method: this.method as Method,
      headers: this.getHeaders(),
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
