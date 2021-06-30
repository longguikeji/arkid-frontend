import { AuthApiNode } from "@/arkfbp/nodes/authApiNode"
import { removeToken } from '@/utils/auth'
import { GlobalValueModule } from '@/store/modules/global-value'
import getBaseUrl from '@/utils/get-base-url'
import { TenantModule } from '@/store/modules/tenant'

export class Logout extends AuthApiNode {
  async run() {
    const com = this.inputs.com
    const currentPage = com.$route.meta?.page
    const router = com.$router
    const originUrl = GlobalValueModule.originUrl
    this.url = '/api/v1/user/logout/'
    this.method = 'GET'
    const outputs = await super.run()
    if (outputs.is_succeed) {
      removeToken()
      if (GlobalValueModule.slug === '') {
        TenantModule.changeCurrentTenant({})
      }
      if (currentPage === 'tenant_config') {
        window.location.href = originUrl + getBaseUrl() + '/login'
      } else {
        router.push('/login')
      }
    }
  }
}