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
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
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
  tag?: string // 页面指向
  path?: string // 执行操作的路径
  method?: string // 执行操作的方式
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
    if (init) this.initPageMainState(init)
    if (local) this.initPageLocalButtonState(local)
    if (global) this.initPageGlobalButtonState(global)
    return this.inputs
  }

  initPageMainState(init: ITagPageAction) {
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
        this.initFormMainState(schema)
        break
    }
  }

  initTableMainState(schema: ISchema) {
    const { _temp: state, _opts: options, _page: page } = this
    state.table!.isExpand = options?.tableIsExpand
    const properties = schema.properties
    if (!properties) return
    for (const prop in properties) {
      const iprop = properties[prop]
      const { title, format, type } = iprop
      if (prop === 'uuid' || type === 'object') continue
      const columnState: TableColumnState = {
        label: title,
        prop: prop,
        width: TABLE_COLUMN_WIDTH[page] && TABLE_COLUMN_WIDTH[page][prop],
        showOverflowTooltip: true
      }
      if (prop === 'url' || format === 'uri') {
        columnState.scope = {
          type: 'Link',
          state: {
            value: '',
            displayContent: 'link',
            type: 'primary'
          }
        }
      }
      if (prop === 'logo' || prop === 'icon') {
        columnState.scope = {
          type: 'ImageBox',
          state: {
            value: ''
          }
        }
      }
      state.table!.columns!.push(columnState)
      this.initTableRowDetailState(prop, iprop)
    }
  }

  initTableRowDetailState(propName: string, propSchema: ISchema) {
    const { dialogs, actions, table } = this._temp
    const { title, type } = propSchema
    if (!dialogs!.detail) {
      dialogs!.detail = {
        visible: false,
        state: {
          type: 'Descriptions',
          state: {
            items: {},
            border: true,
            direction: 'vertical',
          }
        }
      }
      table!.detailAction = 'detail'
      actions!.detail = [
        {
          name: 'arkfbp/flows/detail'
        },
        {
          name: 'arkfbp/flows/assign',
          response: {
            'dialogs.detail.visible': true
          }
        }
      ]
    }
    const items = dialogs!.detail.state.state.items
    if (type === 'object') {
      items[propName] = {
        items: {},
        border: true,
        column: 1,
        direction: 'vertical'
      }
    } else {
      items[propName] = {
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

  initFormMainState(schema: ISchema) {
    const { _temp: state, _opts: options } = this
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
          results.forEach(item => {
            this.initInputList(item)
          })
        }
      }
    } else if (forms) {
      state.forms = forms
      state.select = select
      state.form = undefined
      Object.keys(forms).forEach(key => {
        const items = forms[key].items || {}
        const keys = Object.keys(items)
        if (keys.length) {
          const inputListItems = this.getInputListItems(items)
          if (inputListItems && inputListItems.length > 0) {
            inputListItems.forEach(item => {
              this.initInputList(item)
            })
          }
        }
      })
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

  initPageFilterState(init: ITagPageAction, schema: ISchema) {
    const { path, method } = init
    const properties = schema.properties
    if (!properties) return
    const params = getParamsByPath(path, method)
    if (!params) return
    const state = this._temp
    params.forEach(param => {
      const { in: i, name: n, schema: s, description: d } = param
      const title = properties[n] && properties[n].title
      const flag = n === 'page' || n === 'page_size'
      if (i === 'query' && !flag) {
        if (!state.filter) {
          state.filter = {
            inline: true,
            size: 'mini',
            items: {}
          }
        }
        const label = d || title || n
        const type = s && s.format === 'date-time' ? 'DatePicker' : 'Input'
        state.filter.items![n] = {
          type,
          isSetWidth: false,
          label,
          state: {
            value: '',
            placeholder: `请输入${label}`,
            clearable: true
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
          action: 'toFilter',
          icon: 'el-icon-search',
          size: 'mini'
        }
      }
      state.actions!.toFilter = [
        {
          name: 'arkfbp/flows/resetPagination'
        },
        'fetch'
      ]
    }
  }

  initPageLocalButtonState(locals: ITagPageOperation) {
    if (this._type !== 'FormPage') {
      this.initPageButtonState(locals, 'local')
    }
  }

  initPageGlobalButtonState(globals: ITagPageOperation) {
    this.initPageButtonState(globals, 'global')
  }

  initPageButtonState(actions: ITagPageOperation, role: ButtonRole) {
    for (const key in actions) {
      if (key === 'node') continue
      const action = actions[key]
      let button: ButtonState | null = null
      if ((action as ITagPageMapping).tag) { // point new page
        const { tag, description, icon } = action as ITagPageMapping
        this.initDialogPageState(tag, key)
        if (!description) continue
        button = this.getButtonState({ description, key, mode: 'open', role, icon, tag })
      } else {
        const description = action.description || (action['write'] && action['write'].description) || (action['read'] && action['read'].description)
        if (!description) continue
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
            button = this.getButtonState({ description, key, mode: 'direct', role, icon, path: action['path'], method: action['method'] })
        }
      }
      if (button) {
        role === 'global' ? this.addGlobalButton(button) : this.addLocalButton(button)
      }
    }
  }

  initDialogPageState(tag: string, key: string) {
    const state = this.inputs.state
    const pages = state._pages_
    if (pages.indexOf(tag) === -1) {
      state._pages_.push(tag)
      this._temp.dialogs![key] = {
        visible: false,
        page: tag
      }
    }
  }

  initInputList(item: FormItemState) {
    const { _temp: state, _page: page } = this
    item.state.parent = page
    const listPage = item.state.page
    const pages = this.inputs.state._pages_
    if (pages.indexOf(listPage) === -1 ) {
      pages.push(listPage)
    }
    // add init inputlist state
    state.dialogs![listPage] = {
      visible: false,
      page: listPage
    }
    state.actions![`close${listPage}`] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${listPage}.visible`]: false
        }
      }
    ]
    state.actions!.initInputList = [
      {
        name: 'flows/common/inputList/init'
      }
    ]
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
    const columns = state.table!.columns
    const len = columns?.length as number
    if (!len) return
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

  getButtonState(props: IButtonProps) {
    const pageType = this._type
    const { key, description, mode, role, icon, tag, path, method } = props
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
    if (key === 'delete' || key === 'logout' || key === 'logoff' || key === 'token') type = 'danger'
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