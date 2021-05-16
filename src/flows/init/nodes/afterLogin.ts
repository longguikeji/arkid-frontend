import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { UserModule } from '@/store/modules/user'
import { getToken } from '@/utils/auth'

export class AfterLogin extends AuthApiNode {
  async run() {
    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    const token = getToken()
    if (token) {
      // 获取OpenAPI内容
      await OpenAPI.instance.init('/api/schema?format=json')

      // 进行用户信息的获取，包括用户的头像、名称、用户的uuid以及用户的权限
      this.url = '/api/v1/user/info/'
      this.method = 'get'
      const userInfo = await super.run()
      UserModule.setUser(userInfo)
    }
  }
}
