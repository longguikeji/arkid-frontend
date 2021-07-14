import { FunctionNode } from 'arkfbp/lib/functionNode'
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
import SelectState from '@/admin/common/Form/Select/SelectState'
import { underlineConvertUpperCamel } from '@/utils/common'

export interface IBasePage extends BaseState {
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

interface BasePageActions {
  [name: string]: Array<string | IFlow>
}

class BasePage {
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
    created: [ 'fetch' ]
  }

  public static create(type: string) {
    const page = new this()
    switch (type) {
      case 'TablePage':
        return this.createTablePage(page)
      case 'FormPage':
        return this.createFormPage(page)
      case 'TreePage':
        this.createTreePage(page)
    }
  }

  private static createTablePage(page: IBasePage) {
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

  private static createFormPage(page: IBasePage) {
    return {
      created: page.created,
      card: page.card,
      form: page.form,
      dialogs: page.dialogs,
      actions: page.actions,
      buttons: page.buttons,
      data: page.data
    }
  }

  private static createTreePage(page: IBasePage) {
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
}

export class PageNode extends FunctionNode {
  async run() {
    let type = this.inputs.initContent.type
    type = underlineConvertUpperCamel(type)
    this.inputs.initContent.type = type
    this.$state.commit(state => {
      state.state = this.getBasePage(type)
    })
    return this.inputs
  }

  getBasePage(type: string) {
    return {
      type: type,
      state: BasePage.create(type)
    }
  }
}