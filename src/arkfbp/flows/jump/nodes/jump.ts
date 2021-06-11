import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Jump extends FunctionNode {
  async run() {
    const com = this.inputs.com
    const target = this.inputs.target
    com.$router.push(target)
  }
}
