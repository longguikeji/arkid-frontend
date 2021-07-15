import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { ITagPage } from '@/config/openapi'
import { isArray } from '@/utils/common'
import OpenAPI from '@/config/openapi'

export class InitPage extends FunctionNode {
  async run() {
    const currentPage = this.inputs.currentPage
    const pageTagInfo = OpenAPI.instance.getOnePageTagInfo(currentPage)
    if (pageTagInfo) {
      const { page: initContent, description } = pageTagInfo
      if (!initContent) return null
      let state: any = null
      const isMultiPage = isArray(initContent)
      if (isMultiPage) {
        state = []
        const len = (initContent as ITagPage[]).length
        for (let i = 0; i < len; i++) {
          const pageState = await this.initPage((initContent as ITagPage[])[i], currentPage, description)
          state.push(pageState)
        }
      } else {
        state = await this.initPage((initContent as ITagPage), currentPage, description)
      }
      await this.runCustomPageFlow(state, currentPage)
      return state
    }
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
    const res = await runFlowByFile(initFileName, {
      initContent,
      currentPage,
      description
    })
    return res.state
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
    if (curstomPageFlow !== '') await runFlowByFile(curstomPageFlow, { state })
  }
}
