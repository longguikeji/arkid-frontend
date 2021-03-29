import { StartNode } from 'arkfbp/lib/startNode'

export class Start extends StartNode {
  async run() {
    const com = this.inputs.com
    const btn = this.inputs.btn
    this.$state.commit((state) => {
      state.com = com
      state.btn = btn
    })
  }
}
