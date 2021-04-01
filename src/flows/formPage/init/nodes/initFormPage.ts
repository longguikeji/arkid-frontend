import { FunctionNode } from 'arkfbp/lib/functionNode'
import FormPageState from '@/admin/FormPage/FormPageState'

export class InitFormPage extends FunctionNode {
  async run() {
    const tempState: FormPageState = {
      created: [{
        name: 'flows/hookFlow/created',
      }],
      beforeDestroy: [{
        name: 'flows/hookFlow/beforeDestroy',
      }],
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
