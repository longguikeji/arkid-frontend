import { FunctionNode } from 'arkfbp/lib/functionNode'
import FormPageState from '@/admin/FormPage/FormPageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: FormPageState = {
      type: 'FormPage',
      card: {
        title: '',
        buttons: []
      },
      pages: [],
      created: 'created',
      beforeDestroy: 'beforeDestroy',
      destroyed: 'destroyed',
      title: '',
      form: {
        items: {},
        inline: false
      },
      dialogs: {},
      bottomButtons: [],
      actions: {
        created: [
          {
            name: 'arkfbp/flows/hookFlow/created'
          }
        ],
        beforeDestroy: [
          {
            'name': 'arkfbp/flows/hookFlow/beforeDestroy'
          }
        ]
      }
    }
    return {
      data: this.inputs,
      state: tempState
    }
  }
}
