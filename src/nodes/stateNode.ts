import OpenAPI, { ISchema } from '@/config/openapi'
import { getSchemaByPath } from '@/utils/schema'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import { BasePage, IPage } from '@/nodes/pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import { generateDialogState, generateButton } from '@/utils/dialog'
import { ITagPage, ITagPageAction, ITagInitUpdateAction } from '@/config/openapi'

export class StateNode extends FunctionNode {

  async run() {
    const { initContent, state } = this.inputs
    const initPath = initContent.init?.path
    const initMethod = initContent.init?.method
    this.initPage(state, initPath, initMethod)
    this.initOperation(state, initContent)
    return this.inputs
  }

  public initPage(pageState: BasePage, path: string, method: string) {
    const operation = OpenAPI.instance.getOperation(path, method)
    if (!operation) return
    const schema = getSchemaByPath(path, method)
    const { type, state } = pageState
    // base page has card element
    state.card!.title = operation.summary || ''
    // diff type page run diff init function
    switch (type) {
      case 'TablePage':
        this.initTable(state, schema)
        break
      case 'FormPage':
        this.initForm(state, schema)
        break
    }
  }

  public initOperation(pageState: BasePage, initContent: ITagPage) {
    const { state } = pageState
    if (!state.dialogs) state.dialogs = {}
    const combinations = Object.assign({}, initContent.page, initContent.item)
    if (combinations) {
      Object.keys(combinations).forEach(key => {
        const action = (combinations[key] as ITagInitUpdateAction).read || combinations[key]
        const path = (action as ITagPageAction).path
        const method = (action as ITagPageAction).method
        this.initPageBtn(pageState, initContent, key)
        const dialogState = generateDialogState(path, method, key) // showReadOnly
        if (dialogState) {
          state.dialogs![key] = dialogState
        }
      })
    }
  }

  private initTable(state: IPage, schema: ISchema) {
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const columnState: TableColumnState = {
        label: iprop.title,
        prop: prop
      }
      state.table?.columns?.push(columnState)
    }
  }

  private initForm(state: IPage, schema: ISchema) {
    const { form, forms, select } = generateForm(schema)
    if (form) {
      if (!state.form) {
        state.form = { items: {}, inline: false }
      }
      state.form.items = form.items
    } else if (forms) {
      state.forms = forms
      state.select = select
    }
  }

  public initPageBtn(pageState: BasePage, initContent: ITagPage, key: string) {
    const { type, state } = pageState
    const btn = generateButton(key, type)
    if (initContent.page?.hasOwnProperty(key)) {
      if (type !== 'FormPage') {
        state.card?.buttons!.push(btn)
      }
    } else {
      if (type === 'TablePage') {
        const columns = state.table!.columns
        const len = columns?.length as number
        if (columns![len - 1].prop !== 'actions') {
          state.table!.columns?.push(
            {
              prop: 'actions',
              label: '操作',
              scope: {
                type: 'ButtonArray',
                state: []
              }
            }
          )
          columns![len].scope!.state.push(btn)
        } else {
          columns![len - 1].scope!.state.push(btn)
        }
      }
    }
  }

}