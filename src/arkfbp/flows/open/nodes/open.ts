import { APINode } from "@/arkfbp/nodes/apiNode";

export class OpenNode extends APINode {
  async run() {
    const { url, params } = this.inputs
    if (!url) return
    let pathParams = ''
    if (params) {
      Object.keys(params).forEach(key => {
        pathParams = pathParams + `&${key}=${params[key]}`
      })
    }
    if (!url.includes('?')) pathParams = '?' + pathParams.substring(1)
    window.open(`${url}${pathParams}`, '_blank')
  }
}
