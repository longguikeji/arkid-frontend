import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangeState extends FunctionNode {
  async run() {
    const tempState = this.$state.fetch().tempState
    const data = this.inputs
    tempState.form.items.forEach((item) => {
      item.state.value = data[item.prop]
    })
    return this.inputs
  }
}
