import { StateNode } from '@/nodes/stateNode'

export class Jump extends StateNode {
  async run() {
    const com = this.inputs.com
    const target = this.inputs.target
    com.$router.push(target)
  }
}
