import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { isArray } from '@/utils/common'
import OpenAPI from '@/config/openapi'

const PAGE_SHOW_READONLY = [ 'profile', 'app.update', 'external_idp.update' ]
const PAGE_DISABLED_TRUE = [ 'profile', 'login_register_config', 'tenant_config', 'tenant_register_privacy_notice', 'system_config', 'system_register_privacy_notice' ]

export interface BasePageOptions {
  description?: string
  showReadOnly?: boolean
  showWriteOnly?: boolean
  disabled?: boolean
}

export class InitPage extends FunctionNode {
  async run() {
    const { page, state } = this.inputs
    if (isArray(page)) {
      for (const i of page) {
        await this.initBasePage(state, i)
        await this.runCustomPageFlow(state, i)
      }
    } else {
      await this.initBasePage(state, page)
      await this.runCustomPageFlow(state, page)
    }
    return state
  }

  async initBasePage(state: object, currentPage: string) {
    const info = OpenAPI.instance.getOnePageTagInfo(currentPage)
    if (!info) return null
    const { page: initContent, description } = info
    if (!initContent) return
    const options: BasePageOptions = { description, showReadOnly: false, disabled: false }
    if (PAGE_SHOW_READONLY.includes(currentPage)) options.showReadOnly = true
    if (PAGE_DISABLED_TRUE.includes(currentPage)) options.disabled = true
    let flow = 'flows/page/basePage'
    if (initContent.type === 'dashboard_page') flow = 'flows/page/dashboardPage/init'
    await runFlowByFile(flow, { state, initContent, currentPage, options })
  }

  async runCustomPageFlow(state: any, currentPage: string) {
    let curstomPageFlow: string = ''
    switch (currentPage) {
      case 'app':
        curstomPageFlow = 'flows/custom/appManager/authPageBtn'
        break
      case 'group':
        curstomPageFlow = 'flows/custom/group/group'
        break
      case 'group_user':
        curstomPageFlow = 'flows/custom/group/groupUser'
        break
      case 'maketplace':
        curstomPageFlow = 'flows/custom/maketplace/initFilter'
        break
      case 'third_part_account':
        curstomPageFlow = 'flows/custom/thirdPartAccount/addUnbindButton'
        break
      case 'login_register_config':
        curstomPageFlow = 'flows/custom/loginRegisterConfig/addAction'
        break
      case 'login_register_config.update':
        curstomPageFlow = 'flows/custom/loginRegisterConfig/options'
        break
      case 'password':
        curstomPageFlow = 'flows/custom/password/addAction'
        break
      case 'tenant_config':
        curstomPageFlow = 'flows/custom/tenant/deleteTenant'
        break
      case 'extension':
      case 'extension.create':
      case 'extension.update':
        curstomPageFlow = 'flows/custom/extension/addAction'
        break
    }
    if (curstomPageFlow !== '') await runFlowByFile(curstomPageFlow, { state, page: currentPage })
  }
}
