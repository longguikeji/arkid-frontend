import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI from '@/config/openapi'

const PAGE_SHOW_READONLY = [ 'profile', 'app.update', 'external_idp.update' ]
const PAGE_DISABLED_TRUE = [ 'profile', 'desktop_config', 'profile_config', 'login_register_config', 'tenant_config', 'tenant_register_privacy_notice', 'system_config', 'system_register_privacy_notice', 'contacts_switch' ]
const EXPAND_TABLE_COLUMN = [ 'contacts_user' ]
const PAGE_READONLY = [ 'profile', 'tenant_config' ]

const PAGE_BASE_FLOW = {
  'table_page': 'flows/page/basePage',
  'form_page': 'flows/page/basePage',
  'tree_page': 'flows/page/basePage',
  'dashboard_page': 'flows/page/dashboardPage/init'
}

const PAGE_CUSTOM_FLOW = {

}

export interface BasePageOptions {
  description?: string
  readonly?: boolean
  showReadOnly?: boolean
  showWriteOnly?: boolean
  disabled?: boolean
  isExpandTableColumn?: boolean
}

export class InitPage extends FunctionNode {

  async run() {
    let { page, state } = this.inputs
    if (!state) state = {}
    if (typeof page === 'string') {
      // await this.toPerformPageFlow(page, state)
      await this.initBasePage(state, page)
      await this.runCustomPageFlow(state, page)
    } else {
      for (const i of page) {
        // await this.toPerformPageFlow(i, state)
        await this.initBasePage(state, i)
        await this.runCustomPageFlow(state, i)
      }
    }
    return state
  }

  async toPerformPageFlow(page: string, state: any) {
    await this.toPerformPageBaseFlow(page, state)
    await this.toPerformPageCustomFlow(page, state)
  }

  async toPerformPageBaseFlow(page: string, state: any) {
    // ...
  }

  async toPerformPageCustomFlow(page: string, state: any) {
    const customFlow = PAGE_CUSTOM_FLOW[page]
    if (customFlow) {
      await runFlowByFile(customFlow, { page, state })
    }
  }

  initPageOptions(page: string, options?: BasePageOptions) {
    // ...
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
    if (PAGE_READONLY.includes(currentPage)) options.readonly = true
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
      case 'device':
        customFlow = 'flows/custom/device'
        break
      case 'contacts_group':
        customFlow = 'flows/custom/contacts/group'
        break
      case 'contacts_user':
        customFlow = 'flows/custom/contacts/user'
        break
      case 'contacts_switch.update':
        customFlow = 'flows/custom/contacts/switch'
        break
      case 'subuser':
        customFlow = 'flows/custom/subuser/state'
        break
      case 'user_token_manage':
        customFlow = 'flows/custom/user/token/state'
        break
      case 'profile':
        customFlow = 'flows/custom/user/profile/state'
        break
      case 'profile.update':
        customFlow = 'flows/custom/user/profile/edit'
        break
      case 'profile_config_editfields.update':
        customFlow = 'flows/custom/editfields/state'
        break
    }
    if (customFlow !== '') await runFlowByFile(customFlow, { state, page: currentPage })
  }
}
