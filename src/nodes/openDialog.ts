import { StateNode } from '@/nodes/stateNode'
import FormPageState from '@/admin/FormPage/FormPageState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { debug } from 'console'

export default class OpenDialog extends StateNode {
  get dialog():DialogState | null {
    return null
  }
  
  getValue(prop = '') {
    return ''
  }

  // 之后需要提供 url 和 method 来具体获取某一个 options
  getOptions() {
    return []
  }

  getDialogData() {
    return {}
  }

  async run() {
    if (this.dialog) {
      this.dialog.data = this.getDialogData()
      const currentFormPageState: FormPageState = this.dialog.state
      if (currentFormPageState.form && currentFormPageState.form.items) {
        const currentFormPageItems = currentFormPageState.form.items
        for (const prop in currentFormPageItems) {
          if ('options' in currentFormPageItems[prop].state) {
            currentFormPageItems[prop].state.options = this.getOptions()
          }
          currentFormPageItems[prop].state.value = this.getValue(prop)
        }
      }
      if (currentFormPageState.forms) {
        currentFormPageState.select!.value = this.getValue(currentFormPageState.select!.valueKey)
        for (const fk in currentFormPageState.forms) {
          const form = currentFormPageState.forms[fk]
          if (form.items) {
            for (const prop in form.items) {
              if ('options' in form.items[prop].state) {
                form.items[prop].state.options = this.getOptions()
              }
              let value = this.getValue(prop)
              if (!value) {
                value = form.items[prop].state.default
              }
              form.items[prop].state.value = value
            }
          }
        }
      }
      this.dialog.visible = true
    }
  }
}
