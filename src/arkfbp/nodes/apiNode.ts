import { FunctionNode } from 'arkfbp/lib/functionNode'
import http from '@/login/utils/http'
import { Method, ResponseType, AxiosRequestConfig } from 'axios'

export class APINode extends FunctionNode {

  url: string = ''
  method = 'GET'
  params: any = null
  headers: any = null
  responseType = 'json'

  private options: AxiosRequestConfig = {
    url: '',
    method: 'GET',
    params: null,
    data: null,
    headers: undefined
  }

  initOptions() {
    const options = this.options
    options.url = this.url
    options.method = this.method as Method
    options.headers = this.headers
    options.responseType = this.responseType as ResponseType
    if (this.method.toUpperCase() === 'GET') {
      options.params = this.params
    } else {
      options.data = this.params
    }
  }

  async run() {
    this.initOptions()
    const res = await http(this.options)
    return res.data
  }

}
