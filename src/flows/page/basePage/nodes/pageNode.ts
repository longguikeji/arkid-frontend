import { FunctionNode } from 'arkfbp/lib/functionNode'
import { BaseState } from '@/admin/base/BaseVue'
import { IFlow } from '@/arkfbp'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { FormPage } from '@/admin/FormPage/FormPageState'
import { TreePage } from '@/admin/TreePage/TreePageState'
import CardState from '@/admin/common/Card/CardState'
import FormState from '@/admin/common/Form/FormState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TableState from '@/admin/common/data/Table/TableState'
import TreeState from '@/admin/common/data/Tree/TreeState'
import ButtonState from '@/admin/common/Button/ButtonState'
import PaginationState from '@/admin/common/data/Pagination/PaginationState'
import SelectState from '@/admin/common/Form/Select/SelectState'
import ListItemState from '@/admin/common/data/List/ListState' 
import DescriptionsState from '@/admin/common/Descriptions/DescriptionsState'
import { camelCase } from 'lodash'

export interface BasePage extends BaseState {
  card?: CardState
  filter?: FormState
  dialogs?: { [name: string]: DialogState }
  table?: TableState
  form?: FormState
  select?: SelectState
  forms?: { [value:string]: FormState }
  tree?: TreeState
  buttons?: ButtonState[]
  actions?: { [name: string]: (string | IFlow)[] }
  pagination?: PaginationState
  descriptions?: DescriptionsState
  readonly?: boolean
  list?: {
    header?: CardState
    data?: Array<ListItemState>
  },
  data?: any
}

export class Page {

  static create(type: string) {
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
      card: page.card,
      form: page.form,
      dialogs: page.dialogs,
      actions: page.actions,
      buttons: page.buttons,
      descriptions: page.descriptions,
      data: page.data
    }
  }

  created: string | Function = 'created'
  card: CardState = {
    title: '',
    buttons: []
  }
  filter: FormState | undefined = undefined
  table: TableState = {
    columns: [],
    data: [],
    selection: undefined,
    border: true
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
    const { state, dep, page } = this.inputs
    let type = camelCase(dep.type)
    type = type.charAt(0).toUpperCase() + type.slice(1)
    dep.type = type
    state[page] = {
      type,
      state: Page.create(type)
    }
    return this.inputs
  }
}