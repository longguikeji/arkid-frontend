import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ButtonConfig } from '@/login/interface'
// import LoginComponent from '@/login/components/LoginComponent'
import { jsonp } from 'vue-jsonp'

export class Http extends FunctionNode {
  async run() {
    const com = this.$state.fetch().com
    const btn = this.$state.fetch().btn as ButtonConfig
 
    if (btn.http) {
      const url = btn.http.url
      const method = btn.http.method
      let data = ''
      for (const key in btn.http.params) {
        const formKey = btn.http.params[key]
        data += formKey
        data += '=' + com.currentFormData[formKey]
        data += '&'
      }
      data = data.substr(0, data.length - 1)

      const params = {
        url,
        method,
        data
      }
      const response = await jsonp<string>('api/v1/jsonp/', params)
      return response
    }
    return {}
  }
}
