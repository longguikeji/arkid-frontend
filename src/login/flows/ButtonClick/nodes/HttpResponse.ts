import LoginComponent from '@/login/components/LoginComponent'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import LoginStore from '@/login/store/login'
import { jsonp } from 'vue-jsonp'

export class HttpResponse extends FunctionNode {
  async run() {
    const com = this.$state.fetch().com as LoginComponent

    if (this.inputs.data && this.inputs.error === '0' && this.inputs.data.token) {
      // login success
      
      // 登录之后进行当前登录地址的判断，如果当前登录地址有next参数，重定向到next中
      const next = window.location.search.substring(1).match(/(^|&)next=([^&]*)(&|$)/)
      if (next) {
        const redirectUrl = window.location.origin + decodeURIComponent(next[2])
        window.location.replace(redirectUrl)
        return
      }

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
    }
  }
}
