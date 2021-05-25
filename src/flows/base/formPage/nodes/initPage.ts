import { FunctionNode } from 'arkfbp/lib/functionNode'
import FormPageState from '@/admin/FormPage/FormPageState'

export class InitPage extends FunctionNode {
  async run() {
    const tempState: FormPageState = {
      type: 'FormPage',
      state: {
        card: {
          title: '',
          buttons: []
        },
        created: 'created',
        title: '',
        form: {
          items: {},
          inline: false
        },
        dialogs: {},
        bottomButtons: [],
        actions: {
          created: []
        }
      }
    }

    this.$state.commit(state => {
      state.state = tempState
    })

    return {
      data: this.inputs,
      state: tempState.state
    }
  }
}
