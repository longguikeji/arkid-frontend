import OpenAPI, { ISchema } from '@/config/openapi'
import { getSchemaByPath, getInitContent } from '@/utils/schema'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import { BasePage, IPage } from '@/flows/basePage//nodes/pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import { generateDialogState, generateButton, addItemAction } from '@/utils/dialog'
import { ITagPage, ITagPageAction, ITagUpdateAction } from '@/config/openapi'
import ButtonState from '@/admin/common/Button/ButtonState'
import whetherImportListDialog from '@/utils/list-dialog'
import { runFlowByFile } from '@/arkfbp/index'

export class StateNode extends FunctionNode {

  async run() {
    const { initContent, state, currentPage, description } = this.inputs
    const initPath = initContent.init?.path
    const initMethod = initContent.init?.method
    this.initPage(state, initPath, initMethod, description)
    await this.initOperation(state, initContent, currentPage)
    return this.inputs
  }

  initPage(pageState: BasePage, path: string, method: string, description?: string) {
    const schema = getSchemaByPath(path, method)
    const { type, state } = pageState
    // base page has card element
    state.card!.title = description || ''
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

  async initOperation(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const state = pageState.state
    if (!state.dialogs) state.dialogs = {}
    if (initContent.page) {
      this.initPageBtnState(pageState, initContent, currentPage)
    }
    if (initContent.item) {
      await this.initItemBtnState(pageState, initContent, currentPage)
    }
  }

  initPageBtnState(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const { state, type } = pageState
    const page = initContent.page
    const pagekeys = Object.keys(page!)
    for (let i = 0, len = pagekeys.length; i < len; i++) {
      const key = pagekeys[i]
      const action = (initContent.page![key] as ITagUpdateAction).read || initContent.page![key]
      const { path, method } = action
      this.initDialogState(state, path, method, key, currentPage)
      this.initCardButtons(state, key, type, path, method, currentPage)
    }
  }

  async initItemBtnState(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const { state, type } = pageState
    const items = initContent.item
    if (!items) return
    const itemkeys = Object.keys(items)
    for (let i = 0, len = itemkeys.length; i < len; i++) {
      const key = itemkeys[i]
      if (key === 'children') break
      const item = items![key]
      if (typeof item === 'string') {
        await this.initAppointedPage(state, type, item, key)
      } else {
        const action = (initContent.item![key] as ITagUpdateAction).read || initContent.item![key]
        const { path, method } = action
        this.initDialogState(state, path, method, key, currentPage)
        if (key === 'sort') {
          this.initSortButtons(state, action)
        } else {
          this.initItemButtons(state, key, type, path, method, currentPage)
        }
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
  initCardButtons(state: IPage, key: string, type: string, path: string, method: string, currentPage: string) {
    const btn = generateButton(key, path, method, currentPage, type)
    if (!btn) return
    if (type === 'FormPage') {
      state.bottomButtons!.push(btn)
    } else {
      state.card?.buttons!.push(btn)
    } 
  }

  // type => page type( TablePage, FormPage, TreePage )
  initItemButtons(state: IPage, key: string, type: string, path: string, method: string, currentPage: string) {
    const btn = generateButton(key, path, method, currentPage, type)
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

  initSortButtons(state: IPage, action: ITagUpdateAction | ITagPageAction) {
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

  async initAppointedPage(state: IPage, type: string, page: string, key: string) {
    const initContent = getInitContent(page)
    if (!initContent) return null
    const initAction = (initContent! as ITagPage).init
    const { path, method } = initAction as ITagPageAction
    const btn = generateButton(key, path, method, page, type)
    if (!btn) return null
    this.initItemButtons(state, key, type, path, method, page)
    addItemAction(state, path, method, key)
    const res = await runFlowByFile('flows/basePage', {
      currentPage: page,
      initContent
    })
    state.dialogs![key] = {
      state: res.state,
      title: '',
      visible: false
    }
  }

}