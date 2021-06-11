import { FunctionNode } from 'arkfbp/lib/functionNode'
import LoginStore from '@/login/store/login'
import { jsonp } from 'vue-jsonp'
import { error } from '@/constants/error'

export class HttpResponse extends FunctionNode {
  async run() {
    if (this.inputs.data && this.inputs.error === '0' && this.inputs.data.token) {
      // login success
      LoginStore.token = this.inputs.data.token

      if (LoginStore.ThirdUserID && LoginStore.BindUrl) {
        // 绑定用户与第三方账号
        let data = 'user_id=' + LoginStore.ThirdUserID
        if (LoginStore.hasToken()) {
          data += '&token=' + LoginStore.token
        }
        const params = {
          url: LoginStore.BindUrl,
          method: 'post',
          data: data
        }
        await jsonp<string>('api/v1/jsonp/', params)
        LoginStore.BindUrl = ''
        LoginStore.ThirdUserID = ''
      }

      if (LoginStore.NextUrl) {
        window.location.href = LoginStore.NextUrl + '&token=' + LoginStore.token
        LoginStore.NextUrl = ''
      } else {
        window.location.reload()
      }
    } else {
      if (this.inputs.error) {
        if (this.inputs.is_need_refresh && LoginStore.CodeFileName === '') {
          window.location.reload()
        }
        const com = this.$state.fetch().com
        com.$message({
          message: error[this.inputs.error] || this.inputs.message || 'error',
          type: 'error',
          showClose: true
        })
      }
    }
  }
}
