import { FunctionNode } from 'arkfbp/lib/functionNode'
import FormPageState from '@/admin/FormPage/FormPageState'

export class InitFormPage extends FunctionNode {
  async run() {
    const tempState: FormPageState = {
      created: [],
      title: '',
      form: {
        items: {},
        inline: false
      },
      dialogs: {},
      buttons: []
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
