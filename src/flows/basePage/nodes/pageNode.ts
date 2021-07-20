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

export interface BasePageActions {
  [name: string]: Array<string | IFlow>
}

export interface BasePage extends BaseState {
  name?: string
  card?: CardState
  filter?: FormState
  dialogs?: { [name: string]: DialogState }
  table?: TableState
  form?: FormState
  select?: SelectState
  forms?: { [value:string]: FormState }
  tree?: TreeState
  buttons?: Array<ButtonState>
  actions?: BasePageActions
  pagination?: PaginationState
  data?: any
  list?: {
    header?: CardState
    data?: Array<ListItemState>
  }
}

export class Page {

  static createPage(type: string, currentPage: string, parent?: string) {
    const page = new this()
    switch (type) {
      case 'TablePage':
        return this.createTablePage(page, currentPage, parent)
      case 'FormPage':
        return this.createFormPage(page, currentPage, parent)
      case 'TreePage':
        return this.createTreePage(page, currentPage, parent)
    }
  }

  private static createTablePage(page: BasePage, currentPage: string, parent?: string): TablePage {
    return {
      parent,
      name: currentPage,
      created: page.created,
      card: page.card,
      filter: page.filter,
      table: page.table,
      list: page.list,
      dialogs: page.dialogs,
      pagination: page.pagination,
      actions: page.actions,
      data: page.data
    }
  }

  private static createTreePage(page: BasePage, currentPage: string, parent?: string): TreePage {
    return {
      parent,
      name: currentPage,
      created: page.created,
      card: page.card,
      tree: page.tree,
      list: page.list,
      dialogs: page.dialogs,
      actions: page.actions,
      data: page.data
    }
  }

  private static createFormPage(page: BasePage, currentPage: string, parent?: string): FormPage {
    return {
      parent,
      name: currentPage,
      created: page.created,
      card: page.card,
      form: page.form,
      dialogs: page.dialogs,
      actions: page.actions,
      buttons: page.buttons,
      data: page.data
    }
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
  list = undefined
  data = undefined
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

export class PageNode extends FunctionNode {
  async run() {
    const { initContent, currentPage, options } = this.inputs
    const parent = options?.parent
    const type = underlinedStrToUpperCamelStr(initContent.type)
    const state =  this.getPageState(type, currentPage, parent)
    this.inputs.state = state
    return this.inputs
  }

  getPageState(type: string, currentPage: string, parent?: string) {
    return {
      type,
      state: Page.createPage(type, currentPage, parent)
    }
  }
}