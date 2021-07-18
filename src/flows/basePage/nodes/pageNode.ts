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
  card?: CardState
  filter?: FormState
  dialogs?: { [name: string]: DialogState }
  table?: TableState
  form?: FormState
  select?: SelectState
  forms?: { [value:string]: FormState }
  tree?: TreeState
  bottomButtons?: Array<ButtonState>
  actions?: BasePageActions
  pagination?: PaginationState
  data?: any
  list?: {
    header?: CardState
    data?: Array<ListItemState>
  }
}

export class Page {

  static createPage(type: string) {
    const page = new this()
    switch (type) {
      case 'TablePage':
        return this.createTablePage(page)
      case 'FormPage':
        return this.createFormPage(page)
      case 'TreePage':
        return this.createTreePage(page)
    }
  }

  private static createTablePage(page: BasePage): TablePage {
    return {
      created: page.created,
      destroyed: page.destroyed,
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

  private static createTreePage(page: BasePage): TreePage {
    return {
      created: page.created,
      destroyed: page.destroyed,
      card: page.card,
      tree: page.tree,
      list: page.list,
      dialogs: page.dialogs,
      actions: page.actions,
      data: page.data
    }
  }

  private static createFormPage(page: BasePage): FormPage {
    return {
      created: page.created,
      destroyed: page.destroyed,
      card: page.card,
      form: page.form,
      dialogs: page.dialogs,
      actions: page.actions,
      bottomButtons: page.bottomButtons,
      data: page.data
    }
  }

  created: string | Function = 'created'
  destroyed: string | Function = 'destroyed'
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
  bottomButtons: Array<ButtonState> = []
  actions: { [name: string]: Array<string | IFlow> } = {
    created: [ 'fetch' ],
    destroyed: [ {
      name: 'arkfbp/flows/destroyed'
    } ],
  }
}

export class PageNode extends FunctionNode {
  async run() {
    const type = underlinedStrToUpperCamelStr(this.inputs.initContent.type)
    const state =  this.getPageState(type)
    this.inputs.state = state
    return this.inputs
  }

  getPageState(type: string) {
    return {
      type,
      state: Page.createPage(type)
    }
  }
}