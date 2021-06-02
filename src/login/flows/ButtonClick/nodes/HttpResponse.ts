import { FunctionNode } from 'arkfbp/lib/functionNode'
import LoginStore from '@/login/store/login'
import { jsonp } from 'vue-jsonp'

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
        window.location.href = LoginStore.NextUrl
        LoginStore.NextUrl = ''
      } else {
        window.location.reload()
      }
    } else {
      if (this.inputs.error) {
        const com = this.$state.fetch().com
        com.$message({
          message: '用户名或密码不正确',
          type: 'error',
          showClose: true
        })
      }
    }
  }
}
