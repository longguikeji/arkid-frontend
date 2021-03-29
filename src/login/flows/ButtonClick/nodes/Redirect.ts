import { ButtonConfig } from '@/login/interface'
import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Redirect extends FunctionNode {
  async run() {
    const btn = this.$state.fetch().btn as ButtonConfig

    if (btn.redirect) {
      let paramsUrl = ''
      for (const key in btn.redirect.params) {
        const value = btn.redirect.params[key]
        paramsUrl += (key + '=' + value + '&')
      }
      const endNumber = paramsUrl.length - 1
      paramsUrl = paramsUrl.substr(0, endNumber)
      const url = btn.redirect.url + '?' + paramsUrl
      window.location.replace(url)
    }
    return this.inputs
  }
}
