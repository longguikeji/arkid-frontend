import { FunctionNode } from 'arkfbp/lib/functionNode'
import { BaseState } from '@/admin/base/BaseVue'
import { IFlow } from '@/arkfbp'
import CardState from '@/admin/common/Card/CardState'
import FormState from '@/admin/common/Form/FormState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TableState from '@/admin/common/data/Table/TableState'
import TreeState from '@/admin/common/data/Tree/TreeState'
import ButtonState from '@/admin/common/Button/ButtonState'
import { underlinedStrToUpperCamelStr } from '@/utils/common'

interface IPage extends BaseState {
  card?: CardState
  filter?: FormState
  dialogs?: { [name: string]: DialogState }
  table?: TableState
  form?: FormState
  tree?: TreeState
  buttons?: Array<ButtonState>
  actions?: { [name: string]: Array<string | IFlow> }
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
        page.form = undefined
        page.tree = undefined
        break
      case 'FormPage':
        page.table = undefined
        page.tree = undefined
        page.filter = undefined
        break
      case 'TreePage':
        page.table = undefined
        page.form = undefined
        page.filter = undefined
        break
    }
    return page
  }

  created: string | Function | undefined = 'created'
  card: CardState | undefined  = {}
  filter: FormState | undefined  = {}
  table: TableState | undefined  = {}
  form: FormState | undefined  = {}
  tree: TreeState | undefined = {}
  dialogs: DialogState | undefined  = {}
  buttons: Array<ButtonState> | undefined  = []
  actions: { [name: string]: Array<string | IFlow> } | undefined  = {
    created: []
  }

}

export class PageState {

  constructor(type: string) {
    this.type = type
  }
  
  type: string
  state: any = {}

  getPageState() {
    return {
      type: this.type,
      state: Page.createPage(this.type) || this.state
    }
  }

}

export class PageNode extends FunctionNode {

  async run() {
    const initContent = this.inputs.initContent
    let type = initContent.type
    if (type) {
      type = underlinedStrToUpperCamelStr(type)
      let newPageState = new PageState(type)
      const state = newPageState.getPageState()
    } else {
      alert('当前页面没有指定页面类型或组件类型')
    }
  }

}