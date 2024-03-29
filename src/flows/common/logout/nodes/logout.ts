import { APINode } from '@/arkfbp/nodes/apiNode'
import { removeToken } from '@/utils/auth'
import { ConfigModule } from '@/store/modules/config'
import getBaseUrl from '@/utils/get-base-url'
import { TenantModule } from '@/store/modules/tenant'

export class Logout extends APINode {
  async run() {
    const com = this.inputs.com
    const currentPage = com.$route.meta?.page
    const router = com.$router
    const originUrl = ConfigModule.origin
    this.url = '/api/v1/user/logout/'
    this.method = 'GET'
    const outputs = await super.run()
    if (outputs.is_succeed) {
      removeToken()
      if (currentPage === 'tenant_config') {
        window.location.href = originUrl + getBaseUrl() + '/login'
      } else {
        router.push('/login')
      }
    }
  }
}