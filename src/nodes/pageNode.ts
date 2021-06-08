import { FunctionNode } from 'arkfbp/lib/functionNode'
import { underlinedStrToUpperCamelStr } from '@/utils/common'
import { BaseState } from '@/admin/base/BaseVue'
import { IFlow } from '@/arkfbp'
import CardState from '@/admin/common/Card/CardState'
import FormState from '@/admin/common/Form/FormState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TableState from '@/admin/common/data/Table/TableState'
import TreeState from '@/admin/common/data/Tree/TreeState'
import ButtonState from '@/admin/common/Button/ButtonState'
import PaginationState from '@/admin/common/data/Pagination/PaginationState'
import ListItemState from '@/admin/common/data/List/ListState' 
import { TablePage } from '@/admin/TablePage/TablePageState'
import { FormPage } from '@/admin/FormPage/FormPageState'
import { TreePage } from '@/admin/TreePage/TreePageState'
import SelectState from '@/admin/common/Form/Select/SelectState'

export interface IPageActions {
  [name: string]: Array<string | IFlow>
}

export interface IPage extends BaseState {
  card?: CardState
  filter?: FormState
  dialogs?: { [name: string]: DialogState }
  table?: TableState
  form?: FormState
  select?: SelectState
  forms?: { [value:string]: FormState }
  tree?: TreeState
  buttons?: Array<ButtonState>
  actions?: IPageActions
  pagination?: PaginationState
  list?: {
    header?: CardState
    data?: Array<ListItemState>
  }
}

export interface BasePage {
  type: string,
  state: IPage
}

export class Page {

  static createPage(type: string, options?: IPage) {
    const page = new this()
    if (options) {
      Object.keys(options).forEach(key => {
        if (options[key]) {
          page[key] = options[key]
        }
      })
    }
    switch (type) {
      case 'TablePage':
        return this.createTablePage(page)
      case 'FormPage':
        return this.createFormPage(page)
      case 'TreePage':
        return this.createTreePage(page)
    }
    return page
  }

  private static createTablePage(page: IPage): TablePage {
    const tablePage: TablePage = {
      card: page.card,
      filter: page.filter,
      table: page.table,
      list: page.list,
      dialogs: page.dialogs,
      pagination: page.pagination,
      actions: page.actions
    }
    return tablePage
  }

  private static createTreePage(page: IPage): TreePage {
    const treePage: TreePage = {
      card: page.card,
      tree: page.tree,
      list: page.list,
      dialogs: page.dialogs,
      actions: page.actions
    }
    return treePage
  }

  private static createFormPage(page: IPage): FormPage {
    const formPage: FormPage = {
      card: page.card,
      form: page.form,
      dialogs: page.dialogs,
      actions: page.actions
    }
    return formPage
  }

  created: string | Function = 'created'
  card: CardState = {
    title: '',
    buttons: []
  }
  filter: FormState = {}
  table: TableState = {
    columns: [],
    data: [],
    selection: {}
  }
  form: FormState = {
    items: {},
    inline: false
  }
  tree: TreeState = {
    isFilter: true,
    expandOnClickNode: false,
    data: [],
    action: ''
  }
  list = {}
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  }
  dialogs: { [name: string]: DialogState }  = {}
  buttons: Array<ButtonState> = []
  actions: { [name: string]: Array<string | IFlow> } = {
    created: []
  }

}

export class PageNode implements BasePage {

  constructor(type: string) {
    this.type = type
  }
  
  type: string
  state: IPage = {}

  getPageState() {
    return {
      type: this.type,
      state: Page.createPage(this.type) || this.state
    }
  }

}

export class InitPage extends FunctionNode {
  async run() {
    let type = this.inputs.initContent.type
    type = underlinedStrToUpperCamelStr(type)
    const newPageState = new PageNode(type)
    const state =  newPageState.getPageState()
    this.inputs.state = state
    return this.inputs
  }
}
