import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import OpenAPI, { ISchema, ITagPage, ITagPageAction, ITagInitUpdateAction } from '@/config/openapi'
import { getSchemaByPath } from '@/utils/schema'
import { IBasePage } from './pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import { generateDialogState, generateButton, addItemAction } from '@/utils/dialog'
import ButtonState from '@/admin/common/Button/ButtonState'
import whetherImportListDialog from '@/utils/list-dialog'
import { runFlowByFile } from '@/arkfbp/index'

export class StateNode extends FunctionNode {

  async run() {
    const { currentPage, initContent, description } = this.inputs
    const state = this.$state.fetch().state as AdminComponentState
    this.initMainState(state, initContent.init, description)
    await this.initOperationState(state, initContent, currentPage)
    return this.inputs
  }

  initMainState(pageState: AdminComponentState, initAction: ITagPageAction, description?: string) {
    const { path, method } = initAction
    if (!path || !method) return
    const schema = getSchemaByPath(path, method)
    const { type, state } = pageState
    state.card!.title = description || ''
    switch (type) {
      case 'TablePage':
        this.initTable(state, schema)
        break
      case 'FormPage':
        this.initForm(state, schema)
        break
    }
  }

  initTable(state: IBasePage, schema: ISchema) {
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const columnState: TableColumnState = {
        label: iprop.title,
        prop: prop
      }
      state.table?.columns?.push(columnState)
    }
  }

  initForm(state: IBasePage, schema: ISchema) {
    const showReadOnly = true, showWriteOnly = true, disabled = true
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

  async initOperationState(pageState: AdminComponentState, initContent: ITagPage, currentPage: string) {
    const state = pageState.state
    if (!state.dialogs) state.dialogs = {}
    if (initContent.page) {
      this.initPageBtnState(pageState, initContent, currentPage)
    }
    if (initContent.item) {
      await this.initItemBtnState(pageState, initContent, currentPage)
    }
  }

  initPageBtnState(pageState: AdminComponentState, initContent: ITagPage, currentPage: string) {
    const { state, type } = pageState
    const page = initContent.page
    const pagekeys = Object.keys(page!)
    for (let i = 0, len = pagekeys.length; i < len; i++) {
      const key = pagekeys[i]
      const action = (initContent.page![key] as ITagInitUpdateAction).read || initContent.page![key]
      const { path, method } = action
      this.initDialogState(state, path, method, key, currentPage)
      this.initCardButtons(state, key, type as string, path, method, currentPage)
    }
  }

  async initItemBtnState(pageState: AdminComponentState, initContent: ITagPage, currentPage: string) {
    const { state, type } = pageState
    const items = initContent.item
    const itemkeys = Object.keys(items!)
    for (let i = 0, len = itemkeys.length; i < len; i++) {
      const key = itemkeys[i]
      if (key === 'children') break
      const item = (initContent.item![key] as ITagInitUpdateAction).read || initContent.item![key]
      if (typeof item === 'string') {
        await this.initAppointedPage(state, item, key)
      } else {
        const { path, method } = item
        this.initDialogState(state, path, method, key, currentPage)
        if (key === 'sort') {
          this.initSortButtons(state, item)
        } else {
          this.initItemButtons(state, key, type as string, path, method, currentPage)
        }
      }
    }
  }

  initDialogState(state: IBasePage, path: string, method: string, key: string, currentPage: string) {
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

  // type => page type( TablePage, FormPage, TreePage )
  initCardButtons(state: IBasePage, key: string, type: string, path: string, method: string, currentPage: string) {
    const btn = generateButton(key, path, method, currentPage, type)
    if (!btn) return
    state.card?.buttons!.push(btn)
  }

  // type => page type( TablePage, FormPage, TreePage )
  initItemButtons(state: IBasePage, key: string, type: string, path: string, method: string, currentPage: string) {
    const btn = generateButton(key, path, method, currentPage, type)
    if (!btn) return
    if (type === 'TablePage') {
      this.initTableItemButtons(state, btn)
    } else if (type === 'TreePage') {
      this.initTreeItemButtons(state, btn)
    } else if (type === 'FormPage') {
      state.buttons?.push(btn)
    }
  }

  initTableItemButtons(state: IBasePage, btn: ButtonState) {
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

  initTreeItemButtons(state: IBasePage, btn: ButtonState) {
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

  initSortButtons(state: IBasePage, action: ITagInitUpdateAction | ITagPageAction) {
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

  async initAppointedPage(state: any, currentPage: string, key: string) {
    const info = OpenAPI.instance.getOnePageTagInfo(currentPage)
    if (!info) return
    const { page: initContent, description } = info
    if (!initContent) return
    const { path, method } = (initContent as ITagPage).init!
    this.initItemButtons(state, key, (initContent as ITagPage).type, path, method, currentPage)
    addItemAction(state, path, method, key)
    await runFlowByFile('flows/initPage', {
      initContent,
      currentPage,
      description
    }).then((data) => {
      state.dialogs![key] = {
        state: data.state,
        title: '',
        visible: false
      }
    })
  }

}