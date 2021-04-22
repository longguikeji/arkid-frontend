import { FunctionNode } from 'arkfbp/lib/functionNode'
import FormPageState from '@/admin/FormPage/FormPageState'
import { dialog, cardButton } from '@/utils/initpage'

export class InitAction extends FunctionNode {
  async run() {
    let tempState: FormPageState = this.inputs.state
    const initContent = this.inputs.data.initContent
    const baseAction = this.inputs.baseAction
    const prefix = 'flows/fromPage/'
    // action 在FormPage页面只有一种UI类型 => page-type(页面类型)
    if (initContent.page) {
      Object.keys(initContent.page).forEach(key => {
        const action = initContent.page[key]
        let url = action.path || action.write.path
        let method = action.method || action.write.method
        tempState = dialog(tempState, url, method, key, prefix, baseAction)
        if (action.read) {
          url = action.read.path
          method = action.read.method
        }
        const btn = cardButton(url, method, key, prefix)
        tempState.buttons?.push(btn)
      })
    }

    return {
      data: this.inputs.data,
      state: tempState,
    }
  }
}
