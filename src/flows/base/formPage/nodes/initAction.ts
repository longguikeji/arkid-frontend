import { FunctionNode } from 'arkfbp/lib/functionNode'
import { FormPage } from '@/admin/FormPage/FormPageState'
import { generateDialog, cardButton } from '@/utils/automation'

export class InitAction extends FunctionNode {
  async run() {
    let tempState: FormPage = this.inputs.state
    const initContent = this.inputs.data.initContent
    // action 在FormPage页面只有一种UI类型 => page-type(页面类型)
    if (initContent.page) {
      Object.keys(initContent.page).forEach(key => {
        const action = initContent.page[key]
        let url = action.path || action.write.path
        let method = action.method || action.write.method
        generateDialog(tempState, url, method, key)
        if (action.read) {
          url = action.read.path
          method = action.read.method
        }
        const btn = cardButton(tempState, url, method, key)
        tempState.bottomButtons?.push(btn)
      })
    }

    const { state } = this.$state.fetch()

    return {
      data: this.inputs.data,
      state: state
    }
  }
}
