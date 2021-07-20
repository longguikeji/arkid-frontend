import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ISchema, ITagPage, ITagPageAction, ITagPageMapping, ITagPageOperation, ITagPageMultiAction } from '@/config/openapi'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { getSchemaByPath } from '@/utils/schema'
import { BasePage } from '@/flows/basePage/nodes/pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import ButtonState from '@/admin/common/Button/ButtonState'
import { runFlowByFile } from '@/arkfbp/index'
import { firstToUpperCase } from '@/utils/common'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import { initInputList, initPassword, initImport } from '@/utils/special-dialog'

const BUTTON_LABEL = {
  create: '创建',
  import: '导入',
  export: '导出',
  update: '编辑',
  delete: '删除',
  retrieve: '查看',
  password: '修改密码',
  history: '历史记录',
  provisioning: '同步配置',
  mapping: '配置映射',
  profile: '配置概述',
  retry: '重发'
}

export class StateNode extends FunctionNode {
  async run() {
    const { initContent, state, currentPage, options } = this.inputs
    this.initPageMainState(state, initContent.init, currentPage, options)
    await this.initPageOperationState(state, initContent, currentPage)
    return this.inputs
  }

  initPageMainState(pageState: AdminComponentState, operation: ITagPageAction, currentPage: string, options?: BasePageOptions) {
    const { path, method } = operation
    const schema = getSchemaByPath(path, method)
    const { type, state } = pageState
    state.card!.title = options?.description || ''
    switch (type) {
      case 'TablePage':
        this.initTableMainState(state, schema)
        break
      case 'FormPage':
        this.initFormMainState(state, schema, currentPage, options)
        break
    }
  }

  initTableMainState(state: BasePage, schema: ISchema) {
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const columnState: TableColumnState = {
        label: iprop.title,
        prop: prop
      }
      state.table?.columns?.push(columnState)
    }
  }

  initFormMainState(state: BasePage, schema: ISchema, currentPage: string, options?: BasePageOptions) {
    const showReadOnly = options?.showReadOnly === false ? false : true,
          showWriteOnly = options?.showWriteOnly === false ? false : true,
          disabled = options?.disabled === false ? false : true
    const { form, forms, select } = generateForm(schema, showReadOnly, showWriteOnly, disabled)
    if (form) {
      if (!state.form) state.form = { items: {}, inline: false }
      state.form.items = form.items
      initInputList(state, form, currentPage)
    } else if (forms) {
      state.forms = forms
      state.select = select
    }
  }

  async initPageOperationState(pageState: BasePage, initContent: ITagPage, currentPage: string) {
    const { page, item } = initContent
    if (page) await this.initGlobalOperationState(pageState, page, currentPage)
    if (item) await this.initLocalOperationState(pageState, item, currentPage)
  }

  async initGlobalOperationState(pageState: AdminComponentState, operations: ITagPageOperation, currentPage: string) {
    const { state, type } = pageState
    for (const key in operations) {
      const operation = operations[key]
      let button: ButtonState | null = null
      if ((operation as ITagPageMapping).tag) {
        const tag = (operation as ITagPageMapping).tag
        await this.initAppointedPage(state, tag, key, currentPage)
        button = this.generateButtonState(key, tag, type, true)
      } else {
        switch (key) {
          case 'import':
            initImport(state, operation as ITagPageAction, currentPage)
            button = this.generateButtonState(key, currentPage, type, true)
            break
          case 'password':
            initPassword(state, operation as ITagPageAction, currentPage)
            button = this.generateButtonState(key, currentPage, type, true)
            break
          default:
            button = this.generateButtonState(key, currentPage, type, false)
        }
      }
      if (!button) return
      this.addGlobalButton(state, type as string, button)
    }
  }

  async initLocalOperationState(pageState: AdminComponentState, operations: ITagPageOperation, currentPage: string) {
    const { state, type } = pageState
    for (const key in operations) {
      if (key === 'children') continue
      const operation = operations[key]
      let button: ButtonState | null = null
      if ((operation as ITagPageMapping).tag) {
        const tag = (operation as ITagPageMapping).tag
        await this.initAppointedPage(state, tag, key, currentPage)
        button = this.generateButtonState(key, tag, type, true)
      } else {
        switch (key) {
          case 'sort':
            this.addSortButton(state, operation as ITagPageMultiAction)
            break
          case 'password':
            initPassword(state, operation as ITagPageAction, currentPage)
            button = this.generateButtonState(key , currentPage, type, true)
            break
          default:
            button = this.generateButtonState(key , currentPage, type, false)
        }
      }
      if (button) this.addLocalButton(state, type as string, button)
    }
  }

  addGlobalButton(state: BasePage, type: string, button: ButtonState) {
    if (type === 'FormPage') {
      state.buttons?.push(button)
    } else {
      state.card?.buttons!.push(button)
    }
  }

  addLocalButton(state: BasePage, type: string, button: ButtonState) {
    if (type === 'TablePage') {
      this.addTableLocalButton(state, button)
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

  addTableLocalButton(state: BasePage, button: ButtonState) {
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

  async initAppointedPage(state: BasePage, currentPage: string, key: string, parent?: string) {
    const res = await runFlowByFile('flows/initPage', { currentPage, parent })
    state.dialogs![key] = {
      visible: false,
      state: res
    }
  }

  generateButtonState(key: string, currentPage: string, pageType?: string, isOpenPage?: boolean): ButtonState | null {
    return {
      label: BUTTON_LABEL[key],
      action: isOpenPage ? `open${firstToUpperCase(key)}Dialog` : key,
      type: pageType !== 'TreePage' ? ( key === 'delete' ? 'danger' : 'primary' ) : ( key === 'delete' || key === 'update' ? 'text' : 'primary' ),
      disabled: key === 'export' ? true : false,
      hint: currentPage === 'tenant_config' ? '删除后将彻底无法恢复' : undefined
    }
  }
}