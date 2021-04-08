import { AuthApiNode } from '@/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { UserModule } from '@/store/modules/user'

export class Init extends AuthApiNode {
  async run() {
    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    const token = localStorage.getItem('token')
    if (token) {
      await OpenAPI.instance.init('/api/schema?format=json')
      // 进行当前租户的设置操作
      
      // 此外，这里之后也可以进行当前用户信息的获取
      // 包括用户的头像、名称、用户的uuid以及用户的权限
    }
  }
}
