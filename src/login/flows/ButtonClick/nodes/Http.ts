import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ButtonConfig } from '@/login/interface'
import { jsonp } from 'vue-jsonp'
import LoginStore from '@/login/store/login'

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
        if (formKey === 'repassword' && com.currentFormData.repassword !== com.currentFormData.password) {
          return {}
        }
        let value = formKey === 'code_filename' ? LoginStore.CodeFileName : com.currentFormData[formKey]
        data += formKey
        data += '=' + value
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
