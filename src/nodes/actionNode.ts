import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ISchema } from '@/config/openapi'
import { getContent, getSchemaByContent } from '@/utils/schema'
import { getFetchTableAttrs } from '@/utils/table'
import { ITagPage, ITagPageAction, ITagInitUpdateAction } from '@/config/openapi'
import { BasePage, IPage } from './pageNode'
import { addDialogAction, addPageAction } from '@/utils/dialog'

export class ActionNode extends FunctionNode {

  private static schema: ISchema | undefined = {}
  
  async run() {
    const { state, initContent } = this.inputs
    this.pageInitAction(state, initContent.init?.path, initContent.init?.method)
    this.pageOperationAction(state, initContent)
    return this.inputs
  }

  private pageInitAction(pageState: BasePage, path: string, method: string) {
    const content = getContent(path, method)
    ActionNode.schema = getSchemaByContent(content)
    const { type, state } = pageState
    if (type === 'TablePage') {
      this.initTablePageFetchAction(state, path, method, content)
    }
  }

  private initTablePageFetchAction(state: IPage, path: string, method: string, content: { [contentType: string]: {schema: ISchema} }) {
    const attrs = getFetchTableAttrs(content)
    const response = {},
          request = {}
    response['table.data'] = attrs.data
    // pagination
    if (attrs.pagination) {
      response['pagination.total'] = attrs.pagination
      request['page'] = 'pagination.currentPage'
      request['page_size'] = 'pagination.pageSize'
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        action: 'fetch'
      }
    }
    // fetch - init action
    state.created = 'created'
    if (!state.actions) state.actions = {}
    state.actions!.created.push('fetch')
    state.actions.fetch = [
      {
        name: 'arkfbp/flows/fetch',
        url: path,
        method: method,
        request: request,
        response: response
      }
    ]
  }

  private initFormPageFetchAction(state: IPage, path: string, method: string) {

  }

  private initTreePageFetchAction(state: IPage, path: string, method: string) {

  }

  private pageOperationAction(pageState: BasePage, initContent: ITagPage) {
    const combinations = Object.assign({}, initContent.page, initContent.item)
    if (combinations) {
      Object.keys(combinations).forEach(key => {
        const pageAction = (combinations[key] as ITagInitUpdateAction).read || combinations[key]
        const pagePath = (pageAction as ITagPageAction).path
        const pageMethod = (pageAction as ITagPageAction).method
        addPageAction(pageState, pagePath, pageMethod, key)
        const dialogAction = (combinations[key] as ITagInitUpdateAction).write || combinations[key]
        const dialogPath = (dialogAction as ITagPageAction).path
        const dialogMethod = (dialogAction as ITagPageAction).method
        addDialogAction(pageState, dialogPath, dialogMethod, key) // showReadOnly
      })
    }
  }

}