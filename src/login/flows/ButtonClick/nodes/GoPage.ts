import { ButtonConfig } from '@/login/interface'
import { FunctionNode } from 'arkfbp/lib/functionNode'
import LoginComponent from '@/login/components/LoginComponent'

export class GoPage extends FunctionNode {
  async run() {
    const com = this.$state.fetch().com as LoginComponent
    const btn = this.$state.fetch().btn as ButtonConfig

    if (btn.gopage) com.pageData = btn.gopage
    return this.inputs
  }
}
