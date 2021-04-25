import { FunctionNode } from "arkfbp/lib/functionNode";

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const data = this.inputs.data
    const items = state.client.form?.items
    if (items) {
      const key = Object.keys(data)[0]
      const accounts = data[key]
      items[key].state.options = []
      accounts.forEach(account => {
        items[key]?.state?.options?.push({
          value: account.unbind,
          label: account.name
        })
      })
      items[key].state.action = [
        {
          name: 'flows/thirdPartyAccount/addUnbindButton'
        }
      ]
      items[key].state.multiple = false
      items[key].state.value = ''
    }
    return this.inputs
  }
}
