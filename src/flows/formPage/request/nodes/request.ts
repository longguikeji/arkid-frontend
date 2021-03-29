import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'

export class Request extends TokenAPINode {
  async run() {
    this.url = this.inputs.params.url
    this.method = this.inputs.params.method
    this.params = {}
    const type = this.inputs.params.type
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    if (type === 'form') {
      const formItems = tempState.form.items
      for (let i = 0; i < formItems.length; i++) {
        if (!(formItems[i] instanceof Array)) {
          this.params[formItems[i].prop] = formItems[i].state.value
        }
      }
    } else if (type === 'dialog') {
      const dialogItems = tempState.dialogs.request.items
      for (let i = 0; i < dialogItems.length; i++) {
        this.params[dialogItems[i].prop] = dialogItems[i].state.value
      }
    }
    const outputs = await super.run()
    if (tempState && tempState.dialogs) {
      tempState.dialogs.request.visible = false
    }
    return outputs
  }
}
