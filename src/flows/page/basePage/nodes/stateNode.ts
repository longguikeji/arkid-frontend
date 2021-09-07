import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ISchema, ITagPage, ITagPageAction, ITagPageMapping, ITagPageMultiAction } from '@/config/openapi'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { getSchemaByPath, isImportInputList } from '@/utils/schema'
import { BasePage } from './pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import ButtonState from '@/admin/common/Button/ButtonState'
import { runFlowByFile } from '@/arkfbp/index'
import { firstToUpperCase } from '@/utils/common'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import { addInputListDialog, addPasswordDialog, addImportDialog } from '@/utils/dialogs'
import hasPermission from '@/utils/role'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import { getButtonDefaultLabel } from '@/utils/button'
import { TABLE_COLUMN_WIDTH } from '@/utils/table'

export class StateNode extends FunctionNode {
  async run() {
    const { initContent, state, currentPage, options } = this.inputs
    if (initContent.init) await this.initPageMainState(state[currentPage], initContent.init, currentPage, options)
    if (initContent.filter) await this.initPageFilterState(state[currentPage], initContent.filter, currentPage, options)
    await this.initPageOperationState(state[currentPage], initContent, currentPage)
    return this.inputs
  }

  async initPageMainState(pageState: AdminComponentState, operation: ITagPageAction, currentPage: string, options?: BasePageOptions) {
    const { path, method } = operation
    const schema = getSchemaByPath(path, method)
    if (!schema) return
    const { type, state } = pageState
    state.card!.title = options?.description || ''
    switch (type) {
      case 'TablePage':
        this.initTableMainState(state, schema, options)
        break
      case 'FormPage':
        await this.initFormMainState(state, schema, currentPage, options)
        break
    }
  }

  initTableMainState(state: BasePage, schema: ISchema, options?: BasePageOptions) {
    const name = state.name
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const columnState: TableColumnState = {
        label: iprop.title,
        prop: prop,
        width: name ? TABLE_COLUMN_WIDTH[name][prop] : undefined,
        showOverflowTooltip: true
      }
      state.table?.columns?.push(columnState)
    }
    state.table!.isExpand = options?.isExpandTableColumn || false
  }

  async initFormMainState(state: BasePage, schema: ISchema, currentPage: string, options?: BasePageOptions) {
    const showReadOnly = options?.showReadOnly === false ? false : true,
          showWriteOnly = options?.showWriteOnly === false ? false : true,
          disabled = options?.disabled === false ? false : true
    const { form, forms, select } = generateForm(schema, showReadOnly, showWriteOnly, disabled)
    if (form) {
      if (!state.form) state.form = { items: {}, inline: false }
      const items = form.items
      state.form.items = items
      if (items) {
        const inputListItems = []
        isImportInputList(items, inputListItems)
        if (inputListItems.length) {
          inputListItems.forEach(async (item) => {
            await this.initInputList(state, currentPage, item)
          })
        }
      }
    } else if (forms) {
      state.forms = forms
      state.select = select
    }
  }

  async initPageFilterState(pageState: AdminComponentState, operation: ITagPageAction, currentPage: string, options?: BasePageOptions) {
    const { path, method } = operation
    const schema = getSchemaByPath(path, method)
    const { form } = generateForm(schema, false, true, false)
    if (form) {
      for (const key in form.items) {
        let item = form.items[key]
        form.items[key] = {
          ...item,
          isSetWidth: false
        }
      }
      pageState.state.filter = {
        inline: true,
        size: 'mini',
        items: Object.assign(form.items, {
          action: {
            type: 'Button',
            isSetWidth: false,
            state: {
              label: '搜索',
              type: 'primary',
              action: 'fetch'
            }
          }
        })
      }
    }
  }

  async initPageOperationState(pageState: AdminComponentState, initContent: ITagPage, currentPage: string) {
    const { global, local } = initContent
    const { state, type } = pageState
    const localKeys = Object.keys(local || {})
    const operations = Object.assign({}, global, local)
    for (const key in operations) {
      if (key === 'children') continue
      const operation = operations[key]
      let button: ButtonState | null = null
      if ((operation as ITagPageMapping).tag) {
        const { tag, description } = operation as ITagPageMapping
        await this.initAppointedPage(state, tag, key)
        button = this.generateButtonState(key, tag, type, true, description)
      } else {
        switch (key) {
          case 'import':
            addImportDialog(this.inputs.state, state, operation as ITagPageAction, currentPage)
            button = this.generateButtonState(key, currentPage, type, true, (operation as ITagPageAction).description)
            break
          case 'password':
            addPasswordDialog(this.inputs.state, state, operation as ITagPageAction, currentPage)
            button = this.generateButtonState(key, currentPage, type, true, (operation as ITagPageAction).description)
            break
          case 'sort':
            this.addSortButton(state, operation as ITagPageMultiAction)
            break
          default:
            button = this.generateButtonState(key, currentPage, type, false, (operation as ITagPageAction).description)
        }
      }
      if (!button) continue
      localKeys.includes(key) ? this.addLocalButton(state, type as string, button, localKeys.length) : this.addGlobalButton(state, type as string, button)
    }
  }
  
  addGlobalButton(state: BasePage, type: string, button: ButtonState) {
    if (type === 'FormPage') {
      state.buttons?.push(button)
    } else {
      state.card?.buttons!.push(button)
    }
  }

  addLocalButton(state: BasePage, type: string, button: ButtonState, amount: number) {
    if (type === 'TablePage') {
      this.addTableLocalButton(state, button, amount)
    } else if (type === 'TreePage') {
      this.addTreeLocalButton(state, button)
    }
  }

  addSortButton(state: BasePage, operation: ITagPageMultiAction) {
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

  addTableLocalButton(state: BasePage, button: ButtonState, amount: number) {
    const columns = state.table!.columns
    const len = columns?.length as number
    const name = state.name
    if (columns![len - 1].prop !== 'actions') {
      state.table!.columns?.push(
        {
          prop: 'actions',
          fixed: 'right',
          label: '操作',
          width: name ? TABLE_COLUMN_WIDTH[name].actions : undefined,
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

  addTreeLocalButton(state: BasePage, button: ButtonState) {
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

  async initAppointedPage(state: BasePage, currentPage: string, key: string) {
    await runFlowByFile('flows/initPage', { page: currentPage, state: this.inputs.state })
    if (key) {
      state.dialogs![key] = {
        visible: false,
        page: currentPage
      }
    }
  }

  generateButtonState(key: string, currentPage: string, pageType?: string, isOpenPage?: boolean, description?: string, hint?: string): ButtonState | null {
    if (!hasPermission(currentPage)) return null
    const type = pageType !== 'TreePage' ? ( key === 'delete' ? 'danger' : 'primary' ) : ( key === 'delete' || key === 'update' ? 'text' : 'primary' )
    const action = isOpenPage ? `open${firstToUpperCase(key)}Dialog` : key
    const label = description || getButtonDefaultLabel(key)
    const disabled = key === 'export' ? true : false
    return {
      label, action, disabled, type, hint
    }
  }

  async initInputList(state: BasePage, currentPage: string, item: FormItemState) {
    item.state.parent = currentPage
    const listPage = item.state.page
    addInputListDialog(state, listPage)
    const pageState = this.inputs.state[listPage]
    if (pageState) return
    await runFlowByFile('flows/initPage', { page: listPage, state: this.inputs.state })
    const list = {
      header: {
        title: '已选数据列表',
        buttons: [
          {
            label: '确认所选',
            type: 'primary',
            action: 'confirm'
          }
        ]
      },
      data: []
    }
    this.inputs.state[listPage].state.list = list
  }
}