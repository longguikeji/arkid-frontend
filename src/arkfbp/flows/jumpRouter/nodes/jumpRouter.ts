import { FunctionNode } from 'arkfbp/lib/functionNode'

export class JumpRouter extends FunctionNode {
  async run() {
    const data = this.inputs.data
    const clientServer = this.inputs.clientServer
    const router = this.inputs.router

    if(!this.inputs.router) {
      return
    }

    const state = require(`@/${clientServer.src.split('.').join('/')}.json`)
    this.inputs.client = state

    this.inputs.client[clientServer.data] = data
    router.replace({
      path: `/${clientServer.path.split('.').join('/')}`
    })
  }
}
