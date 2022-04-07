import { APINode } from 'arkfbp/lib/apiNode'
import http from '@/login/utils/http'
import { AxiosRequestConfig } from 'axios'
import { RULE_REGEXP } from '@/utils/rules'

export class Export extends APINode {
  private _type = 'application/vnd.ms-excel'

  private options: AxiosRequestConfig = {
    url: '',
    method: 'GET',
    data: null,
    params: null,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': this._type,
    },
  }

  private _filename = new Date().toLocaleDateString().replace(/\//g, '-') + '.xls'

  async run() {
    const { url, method } = this.inputs
    if (!url || !method) return

    // options
    this.options.url = url
    if (method) this.options.method = method
    const res = await http(this.options)
    const { data, headers } = res
    if (!data) return

    // 获取指定文件名
    const disposition = headers['content-disposition']
    const matches = disposition && disposition.match(RULE_REGEXP.filename)
    const filename = matches ? matches[1].replace(/['"]/g, '') : this._filename
    // 下载导出文件
    let blob = new Blob([data], { type: this._type })
    if ('download' in document.createElement('a')) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // @ts-ignore
      navigator.msSaveBlob(blob, filename)
    }
  }
}
