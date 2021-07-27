import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { isArray } from '@/utils/common'
import OpenAPI from '@/config/openapi'

const PAGE_SHOW_READONLY = [ 'profile', 'app_list_update', 'external_idp_update' ]
const PAGE_DISABLED_TRUE = [ 'profile', 'login_register_config', 'tenant_config', 'tenant_register_privacy_notice', 'system_config', 'system_register_privacy_notice' ]

export interface BasePageOptions {
  description?: string
  showReadOnly?: boolean
  showWriteOnly?: boolean
  disabled?: boolean
  parent?: string
}

export class InitPage extends FunctionNode {
  async run() {
    const page: string | string[] = this.inputs.page
    let state: any = null
    if (isArray(page)) {
      state = []
      for (const p of page) {
        const res = await this.initBasePage(p)
        state.push(res)
      }
    } else {
      state = await this.initBasePage(page as string)
    }
    return state
  }

  async initBasePage(currentPage: string) {
    const info = OpenAPI.instance.getOnePageTagInfo(currentPage)
    if (!info) return null
    const { page: initContent, description } = info
    if (!initContent) return null
    let options: BasePageOptions = { description, showReadOnly: false, disabled: false, parent: this.inputs.parent }
    if (PAGE_SHOW_READONLY.includes(currentPage)) options.showReadOnly = true
    if (PAGE_DISABLED_TRUE.includes(currentPage)) options.disabled = true
    let flow = 'flows/basePage'
    if (initContent.type === 'dashboard_page') flow = 'flows/dashboardPage/init'
    const res = await runFlowByFile(flow, { initContent, currentPage, options })
    const state = res.state
    await this.runCustomPageFlow(state, currentPage)
    return state
  }

  async runCustomPageFlow(state: any, currentPage: string) {
    let curstomPageFlow: string = ''
    switch (currentPage) {
      case 'app':
        curstomPageFlow = 'flows/appManager/authPageBtn'
        break
      case 'group':
        curstomPageFlow = 'flows/group/changeFetch'
        break
      case 'maketplace':
        curstomPageFlow = 'flows/maketplace/initFilter'
        break
      case 'third_party_account':
        curstomPageFlow = 'flows/thirdPartyAccount/addUnbindButton'
        break
      case 'login_register_config':
        curstomPageFlow = 'flows/loginRegisterConfig/updated'
        break
      case 'password':
        curstomPageFlow = 'flows/passwordManager/addAction'
        break
      case 'tenant_config':
        curstomPageFlow = 'flows/tenant/deleteTenant'
        break
      case 'extension':
        curstomPageFlow = 'flows/extension/addAction'
    }
    if (curstomPageFlow !== '') await runFlowByFile(curstomPageFlow, { state })
  }
}
