import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI from '@/config/openapi'

const SHOW_READONLY_PAGE = [ 'profile', 'app.update', 'external_idp.update' ]

const DISABLED_PAGE = [ 'profile_config', 'login_register_config', 'tenant_register_privacy_notice', 'system_config', 'system_register_privacy_notice' ]

const EXPAND_TABLE_PAGE = [ 'contacts_user' ]

const READONLY_PAGE = [ 'profile', 'tenant_config' ]

const PAGE_BASE_FLOW = {
  'table_page': 'flows/page/base',
  'form_page': 'flows/page/base',
  'tree_page': 'flows/page/base'
}

const DASHBOARD_PAGE_FLOW = {
  'desktop': 'flows/page/dashboard/desktop',
  'notice': 'flows/page/dashboard/desktop',
  'backlog': 'flows/page/dashboard/desktop',
  'statistics': 'flows/page/dashboard/statistics'
}

const PAGE_CUSTOM_FLOW = {
  'app': 'flows/custom/appManager/authPageBtn',
  'extension': 'flows/custom/extension/addAction',
  'extension.create': 'flows/custom/extension/addAction',
  'extension.update': 'flows/custom/extension/addAction',
  'login_register_config': 'flows/custom/loginRegisterConfig/addAction',
  'login_register_config.update': 'flows/custom/loginRegisterConfig/options',
  'password': 'flows/custom/password/addAction',
  'profile': 'flows/custom/profile',
  'profile.update': 'flows/custom/user/profile/edit',
  'profile_config_editfields.update': 'flows/custom/editfields/state',
  'subuser': 'flows/custom/subuser/state',
  'third_part_account': 'flows/custom/thirdPartAccount/addUnbindButton',
  'tenant': 'flows/custom/tenant/addButton',
  'tenant_config': 'flows/custom/tenant/deleteTenant',
  'user_token_manage': 'flows/custom/user/token/state'
}

export interface BasePageOptions {
  description?: string
  readonly?: boolean
  disabled?: boolean
  showReadOnly?: boolean
  showWriteOnly?: boolean
  tableIsExpand?: boolean
}

export class InitPage extends FunctionNode {

  async run() {
    let { page, state } = this.inputs
    if (!state) { state = {} }
    if (typeof page === 'string') {
      await this.toPerformPageFlow(page, state)
    } else {
      for (const i of page) {
        await this.toPerformPageFlow(i, state)
      }
    }
    return state
  }

  async toPerformPageFlow(page: string, state: any) {
    await this.toPerformPageBaseFlow(page, state)
    await this.toPerformPageCustomFlow(page, state)
  }

  async toPerformPageBaseFlow(page: string, state: any) {
    const tag = OpenAPI.instance.getOnePageTag(page)
    if (tag) {
      // dep 代表当前生成page所指页面的’依赖‘，来自OpenAPI描述信息
      const { page: dep, description } = tag
      const pageType = dep?.type
      const options = this.initPageOptions(page, { description })
      if (pageType && PAGE_BASE_FLOW[pageType]) {
        await runFlowByFile(PAGE_BASE_FLOW[pageType], { state, dep, page, options })
      } else if (DASHBOARD_PAGE_FLOW[page]) {
        await runFlowByFile(DASHBOARD_PAGE_FLOW[page], { state, dep, page, options })
      }
    }
  }

  async toPerformPageCustomFlow(page: string, state: any) {
    const customFlow = PAGE_CUSTOM_FLOW[page]
    if (customFlow) {
      await runFlowByFile(customFlow, { page, state })
    }
  }

  initPageOptions(page: string, options: BasePageOptions) {
    options.showReadOnly = SHOW_READONLY_PAGE.includes(page)
    options.disabled = DISABLED_PAGE.includes(page)
    options.readonly = READONLY_PAGE.includes(page)
    options.tableIsExpand = EXPAND_TABLE_PAGE.includes(page)
    return options
  }
}
