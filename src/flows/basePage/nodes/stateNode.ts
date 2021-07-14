import OpenAPI, { ISchema, ITagPage, ITagPageAction, ITagUpdateAction, ITagPageOperation } from '@/config/openapi'
import { getSchemaByPath, getInitContent } from '@/utils/schema'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import { BasePage, IPage } from '@/flows/basePage//nodes/pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import { generateDialogState, generateButton, addItemAction } from '@/utils/dialog'
import ButtonState from '@/admin/common/Button/ButtonState'
import whetherImportListDialog from '@/utils/list-dialog'
import { runFlowByFile } from '@/arkfbp/index'

export class StateNode extends FunctionNode {

  async run() {
    const { initContent, state, currentPage, description } = this.inputs
    this.initPageMainState(state, initContent.init, description)
    await this.initPageOperationState(state, initContent, currentPage)
    return this.inputs
  }

  initPageMainState(pageState: BasePage, operation: ITagPageAction, description?: string) {
    const { path, method } = operation
    const schema = getSchemaByPath(path, method)
    const { type, state } = pageState
    state.card!.title = description || ''
    switch (type) {
      case 'TablePage':
        this.initTableMainState(state, schema)
        break
      case 'FormPage':
        this.initFormMainState(state, schema)
        break
    }
  }

  async initPageOperationState(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const { page, item } = initContent
    if (page) {
      this.initGlobalOperationState(pageState, page, currentPage)
    }
    if (item) {
      await this.initLocalOperationState(pageState, item, currentPage)
    }
  }

  initGlobalOperationState(pageState: BasePage, operations: ITagPageOperation, currentPage: string) {
    const { state, type } = pageState
    for (const key in operations) {
      const operation = operations[key]
      const { path, method } = (operation as ITagUpdateAction).read || operation
      const btn = generateButton(key, path, method, currentPage, type)
      if (!btn) continue
      this.addGlobalButton(state, type, btn)
      this.initDialogState(state, path, method, key, currentPage)
    }
  }

  async initLocalOperationState(pageState: BasePage, operations: ITagPageOperation, currentPage: string) {
    const { state, type } = pageState
    for (const key in operations) {
      if (key === 'children') continue
      const operation = operations[key]
      if (typeof operation === 'string') {
        await this.initAppointedPage(state, type, operation, key)
      } else {
        const { path, method } = (operation as ITagUpdateAction).read || operation
        if (key === 'sort') {
          this.addSortButton(state, operation)
        } else {
          const btn = generateButton(key, path, method, currentPage, type)
          if (!btn) continue
          this.addLocalButton(state, type, btn)
        }
        this.initDialogState(state, path, method, key, currentPage)
      }
    }
  }

  initDialogState(state: IPage, path: string, method: string, key: string, currentPage: string) {
    if (!path || !method) return
    if (!state.dialogs) state.dialogs = {}
    const dialogState = generateDialogState(path, method, key, currentPage) // showReadOnly
    if (dialogState) {
      state.dialogs![key] = dialogState
      const importListDialog = whetherImportListDialog(dialogState.state.state)
      if (importListDialog) {
        state.dialogs![key].state.state.dialogs = {
          selected: importListDialog
        }
        state.dialogs![key].state.state.actions = {
          initInputList: [
            {
              name: 'flows/list/initInputList'
            }
          ]
        }
      }  
    }
  }

  initTableMainState(state: IPage, schema: ISchema) {
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const columnState: TableColumnState = {
        label: iprop.title,
        prop: prop
      }
      state.table?.columns?.push(columnState)
    }
  }

  initFormMainState(state: IPage, schema: ISchema) {
    const showReadOnly = true, showWriteOnly = true
    const disabled = true
    const { form, forms, select } = generateForm(schema, showReadOnly, showWriteOnly, disabled)
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

  addGlobalButton(state: IPage, type: string, button: ButtonState) {
    if (type === 'FormPage') {
      state.bottomButtons?.push(button)
    } else {
      state.card?.buttons!.push(button)
    }
  }

  addLocalButton(state: IPage, type: string, button: ButtonState) {
    if (type === 'TablePage') {
      this.addTableLocalButton(state, button)
    } else if (type === 'TreePage') {
      this.addTreeLocalButton(state, button)
    }
  }

  addSortButton(state: IPage, operation: ITagUpdateAction | ITagPageAction) {
    const columnSort = {
      prop: 'sort',
      label: '排序',
      scope: {
        type: 'Sort',
        state: new Array(),
      }
    }
    Object.keys(operation).forEach((sortName) => {
      const actionName = 'sortBy' + sortName
      if (sortName !== 'batch') {
        columnSort.scope.state.push({
          type: sortName,
          action: actionName
        })
      } else {
        state.table!.sortable = true
        state.table!.sortAction = actionName
      }
    })
    state.table?.columns?.push(columnSort)
  }

  addTableLocalButton(state: IPage, button: ButtonState) {
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
      columns![len].scope!.state.push(button)
    } else {
      columns![len - 1].scope!.state.push(button)
    }
  }

  addTreeLocalButton(state: IPage, button: ButtonState) {
    if (!state.tree?.slot) {
      state.tree!.slot = {
        buttons: {
          type: 'ButtonArray',
          state: []
        }
      }
    }
    state.tree!.slot.buttons.state.push(button)
  }

  async initAppointedPage(state: IPage, type: string, page: string, key: string) {
    const initContent = getInitContent(page)
    if (!initContent) return null
    const initAction = (initContent! as ITagPage).init
    const { path, method } = initAction as ITagPageAction
    const btn = generateButton(key, path, method, page, type)
    if (!btn) return null
    this.addLocalButton(state, type, btn)
    addItemAction(state, path, method, key)
    const res = await runFlowByFile('flows/basePage', {
      currentPage: page,
      initContent,
    })
    state.dialogs![key] = {
      state: res.state,
      title: '',
      visible: false
    }
  }

}
