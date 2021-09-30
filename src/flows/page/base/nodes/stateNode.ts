import { FunctionNode } from 'arkfbp/lib/functionNode'
import {
  ISchema,
  ITagPageAction,
  ITagPageMapping,
  ITagPageMultiAction,
  ITagUpdateOperation,
  ITagPageOperation
} from '@/config/openapi'
import { getSchemaByPath, getParamsByPath } from '@/utils/schema'
import { BasePage } from './pageNode'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import generateForm from '@/utils/form'
import ButtonState from '@/admin/common/Button/ButtonState'
import { runFlowByFile } from '@/arkfbp/index'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import { addInputListDialog } from '@/utils/dialogs'
import hasPermission from '@/utils/role'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import { FormItemsState } from '@/admin/common/Form/FormState'
import { TABLE_COLUMN_WIDTH } from '@/utils/table'
import { upperFirst, camelCase } from 'lodash'

type ButtonRole = 'global' | 'local'

type ButtonMode = 'direct' | 'open' | 'close'

interface IButtonProps {
  key: string // 按钮的标识，由OpenAPI描述提供
  description: string // 按钮的文本信息
  mode: ButtonMode // 按钮的模式
  role: ButtonRole // 按钮在页面中扮演的角色
  icon?: string // 按钮的icon图标
}

export class StateNode extends FunctionNode {
  private _page: string = '' // 当前需要初始化state的页面名称
  private _temp: BasePage = {} // 当前页面临时state
  private _type: string = '' // 当前页面的类型
  private _opts: BasePageOptions = {}

  async run() {
    const { dep, state, page, options } = this.inputs
    const { init, local, global } = dep
    this._page = page
    this._temp = state[page].state
    this._type = state[page].type
    this._opts = options
    if (init) await this.initPageMainState(init)
    if (local) await this.initPageLocalButtonState(local)
    if (global) await this.initPageGlobalButtonState(global)
    return this.inputs
  }

  async initPageMainState(init: ITagPageAction) {
    const { path, method } = init
    const schema = getSchemaByPath(path, method)
    if (!schema) return
    this.initPageDescription()
    switch (this._type) {
      case 'TablePage':
        this.initTableMainState(schema)
        this.initPageFilterState(init, schema)
        break
      case 'FormPage':
        await this.initFormMainState(schema)
        break
    }
  }

  initTableMainState(schema: ISchema) {
    const { _temp: state, _opts: options, _page: page } = this
    state.table!.isExpand = options?.tableIsExpand
    state.table!.isDetail = true
    state.table!.detail = {
      visible: false,
      state: {
        type: 'Descriptions',
        state: {
          title: '详情',
          items: {}
        }
      }
    }
    const items = state.table!.detail.state.state.items
    for (const prop in schema.properties) {
      const iprop = schema.properties[prop]
      const title = iprop.title
      const columnState: TableColumnState = {
        label: title,
        prop: prop,
        width: TABLE_COLUMN_WIDTH[page] && TABLE_COLUMN_WIDTH[page][prop],
        showOverflowTooltip: true
      }
      if (prop === 'url' || iprop.format === 'uri') {
        columnState.scope = {
          type: 'Link',
          state: {
            value: '',
            displayContent: 'link',
            type: 'primary'
          }
        }
      }
      state.table!.columns!.push(columnState)
      items[prop] = {
        label: title,
        value: ''
      }
    }
    
  }
  
  initPageDescription() {
    const { _opts: options, _temp: state } = this
    const { readonly, description } = options
    if (readonly) {
      state.descriptions = {
        title: description,
        items: {},
        border: true,
        buttons: []
      }
    } else {
      state.card!.title = description
    }
  }

  async initFormMainState(schema: ISchema) {
    const { _temp: state, _opts: options, _page: page } = this
    const { showReadOnly, showWriteOnly, disabled, readonly } = options
    const { form, forms, select } = generateForm(schema, showReadOnly, showWriteOnly, disabled, readonly)
    if (readonly && form?.items) {
      state.descriptions!.items = form!.items
    } else if (form) {
      const items = form.items
      state.form!.items = items
      if (items) {
        const results = this.getInputListItems(items)
        if (results.length > 0) {
          results.forEach(async (item) => {
            await this.initInputList(item)
          })
        }
      }
    } else if (forms) {
      state.forms = forms
      state.select = select
      state.form = undefined
    }
  }

  getInputListItems(items: FormItemsState, results: FormItemState[] = []) {
    Object.keys(items).forEach(key => {
      const item = items[key]
      if (item.type === 'FormObjectItem') {
        this.getInputListItems(item.state.items, results)
      } else if (item.type === 'InputList') {
        results.push(item)
      }
    })
    return results
  }

  async initPageFilterState(init: ITagPageAction, schema: ISchema) {
    const { path, method } = init
    const properties = schema.properties
    const params = getParamsByPath(path, method)
    if (!params || !properties) return
    const state = this._temp
    params.forEach(param => {
      const point = param.in
      const name = param.name
      if (point === 'query' && properties[name]) {
        if (!state.filter) {
          state.filter = {
            inline: true,
            size: 'mini',
            items: {}
          }
        }
        const label = properties[name].title || name
        state.filter.items![name] = {
          type: 'Input',
          isSetWidth: false,
          label,
          state: {
            value: '',
            placeholder: `请输入${label}`
          }
        }
      }
    })
    if (state.filter) {
      state.filter.items!.action = {
        type: 'Button',
        isSetWidth: false,
        state: {
          label: '搜索',
          type: 'primary',
          action: 'fetch',
          icon: 'el-icon-search'
        }
      }
    }
  }

  async initPageLocalButtonState(locals: ITagPageOperation) {
    if (this._type !== 'FormPage') {
      await this.initPageButtonState(locals, 'local')
    }
  }

  async initPageGlobalButtonState(globals: ITagPageOperation) {
    await this.initPageButtonState(globals, 'global')
  }

  async initPageButtonState(actions: ITagPageOperation, role: ButtonRole) {
    for (const key in actions) {
      const action = actions[key]
      let button: ButtonState | null = null
      if ((action as ITagPageMapping).tag) { // point new page
        const { tag, description, icon } = action as ITagPageMapping
        await this.initDialogPageState(tag, key)
        button = this.getButtonState({ description, key, mode: 'open', role, icon })
      } else {
        const description = action.description || (action['write'] && action['write'].description) || (action['read'] && action['read'].description)
        const icon = action.icon || (action['write'] && action['write'].icon) || (action['read'] && action['read'].icon)
        switch (key) {
          case 'import':
            this.addImportDialog(action as ITagPageAction)
            button = this.getButtonState({ description, key, mode: 'open', role, icon })
            break
          case 'password':
            this.addPasswordDialog(action as ITagPageAction | ITagUpdateOperation)
            button = this.getButtonState({ description, key, mode: 'open', role, icon })
            break
          case 'sort':
            this.addSortButton(action as ITagPageMultiAction)
            break
          default:
            button = this.getButtonState({ description, key, mode: 'direct', role, icon })
        }
      }
      if (button) {
        role === 'global' ? this.addGlobalButton(button) : this.addLocalButton(button)
      }
    }
  }

  async initDialogPageState(tag: string, key: string) {
    await runFlowByFile('flows/initPage', { page: tag, state: this.inputs.state }).then(_ => {
      this._temp.dialogs![key] = {
        visible: false,
        page: tag
      }
    })
  }

  async initInputList(item: FormItemState) {
    const { _temp: state, _page: page } = this
    item.state.parent = page
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
      items: []
    }
    this.inputs.state[listPage].state.list = list
  }

  addImportDialog(action: ITagPageAction) {
    const adminState = this.inputs.state
    const state = this._temp
    const page = this._page
    const { path, method } = action
    adminState.import = {
      type: 'FormPage',
      state: {
        form: {
          items: {
            file: {
              type: 'Upload',
              prop: 'file',
              label: '点击上传文件',
              state: {
                value: '',
                file: null,
                type: 'xlsx'
              }
            }
          }
        },
        buttons: [
          {
            label: '确认',
            action: 'import',
            type: 'primary'
          }
        ],
        actions: {
          import: [
            {
              name: 'arkfbp/flows/import',
              url: path,
              method
            },
            `${page}.closeImportDialog`,
            `${page}.fetch`
          ]
        }
      }
    }
    state.dialogs!.import = {
      visible: false,
      page: 'import'
    }
  }

  addPasswordDialog(action: ITagPageAction | ITagUpdateOperation) {
    const adminState = this.inputs.state
    const state = this._temp
    const page = this._page
    const { path, method } = (action as ITagUpdateOperation).write || action
    const schema = getSchemaByPath(path, method)
    if (!schema) return
    adminState.password = {
      type: 'Password',
      state: {
        action: `${page}.password`,
        hasOldPassword: !!schema.properties?.old_password
      }
    }
    state.dialogs!.password = {
      visible: false,
      page: 'password'
    }
    state.actions!.password = [
      {
        name: 'arkfbp/flows/password',
        url: path,
        method
      },
      `${page}.closePasswordDialog`
    ]
  }

  addSortButton(action: ITagPageMultiAction) {
    const state = this._temp
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

  addGlobalButton(button: ButtonState) {
    const { _type: type, _temp: state, _opts: options, _page: page } = this
    if (type === 'FormPage') {
      if (options.readonly) {
        if (!state.descriptions?.buttons) {
          state.descriptions!.buttons = []
        }
        state.descriptions?.buttons.push(button)
      } else {
        const buttons = state.buttons!
        buttons.push(button)
        if (page?.includes('.') && buttons[0].name !== 'cancel') {
          const parent = page.substring(0, page.lastIndexOf('.'))
          buttons.unshift({
            action: `${parent}.close${upperFirst(camelCase(button.name))}Dialog`,
            label: '取消',
            name: 'cancel'
          })
        }
      }
    } else {
      state.card?.buttons!.push(button)
    }
  }

  addLocalButton(button: ButtonState) {
    const type = this._type
    if (type === 'TablePage') {
      this.addTableLocalButton(button)
    } else if (type === 'TreePage') {
      this.addTreeLocalButton(button)
    }
  }

  addTableLocalButton(button: ButtonState) {
    const state = this._temp
    const page = this._page
    const columns = state.table!.columns
    const len = columns?.length as number
    if (columns![len - 1].prop !== 'actions') {
      state.table!.columns?.push(
        {
          prop: 'actions',
          fixed: 'right',
          label: '操作',
          width: '50',
          scope: {
            type: 'ButtonDropdown',
            state: []
          }
        }
      )
      columns![len].scope!.state.push(button)
    } else {
      columns![len - 1].scope!.state.push(button)
    }
  }

  addTreeLocalButton(button: ButtonState) {
    const state = this._temp
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

  getButtonState(props: IButtonProps, path?: string, method?: string) {
    const page = this._page
    const pageType = this._type
    const { key, description, mode, role, icon } = props
    let available = true
    if (path && method) { // 权限
      // ...
    } else if (page) {
      // ...
    }
    if (!available) return null
    let action = '', type = 'primary'
    switch (mode) {
      case 'open':
        action = `open${upperFirst(camelCase(key))}Dialog`
        break
      case 'close':
        action = `close${upperFirst(camelCase(key))}Dialog`
        break
      default:
        action = key
    }
    if (key === 'delete' || key === 'logout' || key === 'logoff') type = 'danger'
    if (pageType === 'TreePage' && role === 'local') type = 'text'
    if (key === 'import' || key === 'export') type = ''
    return {
      action,
      type,
      disabled: key === 'export' ? true : false,
      label: description,
      name: key,
      icon,
      size: 'mini'
    }
  }
}