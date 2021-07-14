import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI, { ITagPage } from '@/config/openapi'
import { isArray } from '@/utils/common'

export class InitPage extends FunctionNode {
  async run() {
    const currentPage = this.inputs.currentPage
    const info = OpenAPI.instance.getOnePageTagInfo(currentPage)
    if (!info) return
    const { page, description } = info
    if (!page) return
    const isMultiPage = isArray(page)
    let state: any = null
    if (isMultiPage) {
      state = []
      for (let i = 0, len = (page as ITagPage[]).length; i < len; i++) {
        const pageState = await this.initPage(page[i], currentPage, description)
        state.push(pageState)
      }
    } else {
      state = await this.initPage(page as ITagPage, currentPage, description)
    }
    await this.runCustomPageFlow(state, currentPage)
    return state
  }

  async initPage(initContent: ITagPage, currentPage: string, description?: string) {
    let initFileName = ''
    switch (initContent.type) {
      case 'table_page':
      case 'form_page':
      case 'tree_page':
        initFileName = 'flows/basePage'
        break
      case 'dashboard_page':
        initFileName = 'flows/dashboardPage/init'
        break
    }
    return await runFlowByFile(initFileName, {
      initContent,
      currentPage,
      description
    })
  }

  async runCustomPageFlow(state: any, currentPage: string) {
    let curstomPageFlow: string = ''
    switch (currentPage) {
      case 'app_list':
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
      case 'lr_config':
        curstomPageFlow = 'flows/loginRegisterConfig/updated'
        break
      case 'password_factor':
        curstomPageFlow = 'flows/passwordManager/addAction'
        break
      case 'tenant_config':
        curstomPageFlow = 'flows/tenant/deleteTenant'
        break
      case 'extension':
        curstomPageFlow = 'flows/extension/addAction'
    }
    if (curstomPageFlow !== '') {
      await runFlowByFile(curstomPageFlow, { state })
    }
  }
}
