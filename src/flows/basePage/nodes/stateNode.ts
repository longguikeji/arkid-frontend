import OpenAPI, { ISchema } from '@/config/openapi'
import { getSchemaByPath } from '@/utils/schema'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import { BasePage, IPage } from '@/flows/basePage//nodes/pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import { generateDialogState, generateButton } from '@/utils/dialog'
import { ITagPage, ITagPageAction, ITagInitUpdateAction } from '@/config/openapi'
import ButtonState from '@/admin/common/Button/ButtonState'
import whetherImportListDialog from '@/utils/list-dialog'

export class StateNode extends FunctionNode {

  async run() {
    const { initContent, state, currentPage } = this.inputs
    const initPath = initContent.init?.path
    const initMethod = initContent.init?.method
    this.initPage(state, initPath, initMethod)
    this.initOperation(state, initContent, currentPage)
    return this.inputs
  }

  initPage(pageState: BasePage, path: string, method: string) {
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

  initOperation(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const state = pageState.state
    if (!state.dialogs) state.dialogs = {}
    if (initContent.page) {
      this.initPageBtnState(pageState, initContent, currentPage)
    }
    if (initContent.item) {
      this.initItemBtnState(pageState, initContent, currentPage)
    }
  }

  initPageBtnState(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const { state, type } = pageState
    const page = initContent.page
    const pagekeys = Object.keys(page!)
    for (let i = 0, len = pagekeys.length; i < len; i++) {
      const key = pagekeys[i]
      const action = (initContent.page![key] as ITagInitUpdateAction).read || initContent.page![key]
      const { path, method } = action
      this.initDialogState(state, path, method, key, currentPage)
      this.initCardButtons(state, key, type, path, method)
    }
  }

  initItemBtnState(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const { state, type } = pageState
    const items = initContent.item
    const itemkeys = Object.keys(items!)
    for (let i = 0, len = itemkeys.length; i < len; i++) {
      const key = itemkeys[i]
      if (key === 'children') break
      const action = (initContent.item![key] as ITagInitUpdateAction).read || initContent.item![key]
      const { path, method } = action
      this.initDialogState(state, path, method, key, currentPage)
      if (key === 'sort') {
        this.initSortButtons(state, action)
      } else {
        this.initItemButtons(state, key, type, path, method)
      }
    }
  }

  initDialogState(state: IPage, path: string, method: string, key: string, currentPage: string) {
    if (!path || !method) return
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

  initTable(state: IPage, schema: ISchema) {
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const columnState: TableColumnState = {
        label: iprop.title,
        prop: prop
      }
      state.table?.columns?.push(columnState)
    }
  }

  initForm(state: IPage, schema: ISchema) {
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

  // type => page type( TablePage, FormPage, TreePage )
  initCardButtons(state: IPage, key: string, type: string, path: string, method: string) {
    const btn = generateButton(key, path, method, type)
    if (!btn) return
    state.card?.buttons!.push(btn)
  }

  // type => page type( TablePage, FormPage, TreePage )
  initItemButtons(state: IPage, key: string, type: string, path: string, method: string) {
    const btn = generateButton(key, path, method, type)
    if (!btn) return
    if (type === 'TablePage') {
      this.initTableItemButtons(state, btn)
    } else if (type === 'TreePage') {
      this.initTreeItemButtons(state, btn)
    } else if (type === 'FormPage') {
      state.bottomButtons?.push(btn)
    }
  }

  initTableItemButtons(state: IPage, btn: ButtonState) {
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

  initTreeItemButtons(state: IPage, btn: ButtonState) {
    if (!state.tree?.slot) {
      state.tree!.slot = {
        buttons: {
          type: 'ButtonArray',
          state: []
        }
      }
    }
    state.tree!.slot.buttons.state.push(btn)
  }

  initSortButtons(state: IPage, action: ITagInitUpdateAction | ITagPageAction) {
    const columnSort = {
      prop: 'sort',
      label: '排序',
      scope: {
        type: 'Sort',
        state: new Array(),
      }
    }
    Object.keys(action).forEach((sortName) => {
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

}