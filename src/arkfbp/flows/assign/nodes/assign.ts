import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Assign extends FunctionNode {
  async run() {
    this.$state.commit((state: any) => {
      state.inputs = this.inputs
    })
  }
}
