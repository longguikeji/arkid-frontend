import { FunctionNode } from 'arkfbp/lib/functionNode'

export class GetUrlNode extends FunctionNode {
  async run() {
    const url = this.inputs.url
    const data = this.inputs.data
    const state = this.inputs.client

    if (url.indexOf('<') !== -1) {
      const property = url.slice(url.indexOf('<') + 1, url.lastIndexOf('>'))
      return (
        url.slice(0, url.indexOf('<')) + data[property] + url.slice(url.indexOf('>') + 1)
      )
    }
    if (url.indexOf('[') !== -1) {
      const urlParams = url.slice(url.indexOf('[') + 1, url.lastIndexOf(']'))
      let tempState = state
      let tempParams: any
      urlParams.split('.').forEach((v: string) => {
        tempState = tempState[v]
        tempParams = tempState
      })
      return (
        url.slice(0, url.indexOf('[')) + tempParams + url.slice(url.indexOf(']') + 1)
      )
    }
    return url
  }
}
