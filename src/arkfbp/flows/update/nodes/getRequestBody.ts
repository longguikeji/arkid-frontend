import { AuthApiNode } from '@/nodes/authApiNode'

export class GetRequestBody extends AuthApiNode {
  async run() {
    const { mapping } = this.inputs.params
    const params = {}
    if (mapping.type === 'FormPage') {
      const formPage = mapping
      let items
      if (formPage.select && formPage.forms) {
        items = formPage.forms[formPage.select.value].items!
        params[formPage.select.valueKey!] = formPage.select.value
      } else if (formPage.form) {
        items = formPage.form.items!
      }
      for (const prop in items) {
        const value = items[prop].state.value
        if (value) {
          params[prop] = items[prop].state.value
        }
      }
    }
    this.$state.commit(state => {
      state.params = params
    })
    return this.inputs
  }
}
