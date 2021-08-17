import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { isArray } from '@/utils/common'
import OpenAPI from '@/config/openapi'

const PAGE_SHOW_READONLY = [ 'profile', 'app.update', 'external_idp.update' ]
const PAGE_DISABLED_TRUE = [ 'profile', 'login_register_config', 'tenant_config', 'tenant_register_privacy_notice', 'system_config', 'system_register_privacy_notice', 'login_register_config_info' ]
const EXPAND_TABLE_COLUMN = [ 'contacts_user' ]

export interface BasePageOptions {
  description?: string
  showReadOnly?: boolean
  showWriteOnly?: boolean
  disabled?: boolean
  isExpandTableColumn?: boolean
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
    if (EXPAND_TABLE_COLUMN.includes(currentPage)) options.isExpandTableColumn = true
    let flow = 'flows/page/basePage'
    if (initContent.type === 'dashboard_page') flow = 'flows/page/dashboardPage/init'
    await runFlowByFile(flow, { state, initContent, currentPage, options })
  }

  async runCustomPageFlow(state: any, currentPage: string) {
    let customFlow: string = ''
    switch (currentPage) {
      case 'app':
        customFlow = 'flows/custom/appManager/authPageBtn'
        break
      case 'group':
        customFlow = 'flows/custom/group/group'
        break
      case 'group_user':
        customFlow = 'flows/custom/group/groupUser'
        break
      case 'maketplace':
        customFlow = 'flows/custom/maketplace/initFilter'
        break
      case 'third_part_account':
        customFlow = 'flows/custom/thirdPartAccount/addUnbindButton'
        break
      case 'login_register_config':
        customFlow = 'flows/custom/loginRegisterConfig/addAction'
        break
      case 'login_register_config.update':
        customFlow = 'flows/custom/loginRegisterConfig/options'
        break
      case 'password':
        customFlow = 'flows/custom/password/addAction'
        break
      case 'tenant_config':
        customFlow = 'flows/custom/tenant/deleteTenant'
        break
      case 'extension':
      case 'extension.create':
      case 'extension.update':
        customFlow = 'flows/custom/extension/addAction'
        break
      case 'device_manage':
        customFlow = 'flows/custom/device/addAction'
        break
      case 'contacts_group':
        customFlow = 'flows/custom/contacts/group'
        break
      case 'contacts_user':
        customFlow = 'flows/custom/contacts/user'
    }
    if (customFlow !== '') await runFlowByFile(customFlow, { state, page: currentPage })
  }
}
