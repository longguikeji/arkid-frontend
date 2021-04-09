import LoginComponent from '@/login/components/LoginComponent'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import LoginStore from '@/login/store/login'
import { jsonp } from 'vue-jsonp'

export class HttpResponse extends FunctionNode {
  async run() {
    const com = this.$state.fetch().com as LoginComponent

    if (this.inputs.data && this.inputs.error === '0' && this.inputs.data.token) {
      // login success
      LoginStore.token = this.inputs.data.token

      if (LoginStore.ThirdUserID && LoginStore.BindUrl) {
        // 绑定用户与第三方账号
        const params = {
          url: LoginStore.BindUrl,
          method: 'post',
          data: 'user_id=' + LoginStore.ThirdUserID
        }
        await jsonp<string>('api/v1/jsonp/', params)
        LoginStore.BindUrl = ''
        LoginStore.ThirdUserID = ''
      }
      if (LoginStore.NextUrl) {
        window.location.href = LoginStore.NextUrl
        LoginStore.NextUrl = ''
      } else {
        const p = new Promise(() => {
          window.location.reload()
        })
        p.then(() => {
          if (LoginStore.TenantUUID && LoginStore.TenantUUID.length > 0) {
            com.$router.push('/')
          } else {
            com.$router.push('/tenant')
          }
        })
      }
    }
  }
}
