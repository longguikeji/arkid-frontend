import { FunctionNode } from 'arkfbp/lib/functionNode'
import authPage from '@/config/auth/auth_page.json'

export class AuthPageBtn extends FunctionNode {
  async run() {
    const tempState = this.inputs.state.state
    // button
    const authPageBtn = {
      label: '配置授权页面',
      type: 'info',
      action: 'openAuthPage'
    }
    tempState.table?.columns[tempState.table.columns.length - 1]?.scope?.state?.push(authPageBtn)
    tempState.actions!['openAuthPage'] = [
      {
        name: 'flows/appManager/openAuthPage'
      }
    ]
    tempState.actions!['saveTemplate'] = [
      {
        name: 'flows/appManager/saveTemplate',
        url: '/api/v1/tenant/{tenant_uuid}/app/{uuid}/add_auth_tmpl/',
        method: 'POST',
        request: {
          template: {
            value: 'dialogs.auth.state.state.select.value',
            first: {
              icon: 'dialogs.auth.state.state.forms.first.items.icon.state.value',
              title: 'dialogs.auth.state.state.forms.first.items.title.state.value',
              info: 'dialogs.auth.state.state.forms.first.items.info.state.value',
              agree: {
                text: 'dialogs.auth.state.state.forms.first.items.agree.state.form.items.text.state.value',
                tcolor: 'dialogs.auth.state.state.forms.first.items.agree.state.form.items.tcolor.state.value',
                bcolor: 'dialogs.auth.state.state.forms.first.items.agree.state.form.items.bcolor.state.value',
                width: 'dialogs.auth.state.state.forms.first.items.agree.state.form.items.width.state.value',
                height: 'dialogs.auth.state.state.forms.first.items.agree.state.form.items.height.state.value'
              },
              cancel: {
                text: 'dialogs.auth.state.state.forms.first.items.cancel.state.form.items.text.state.value',
                tcolor: 'dialogs.auth.state.state.forms.first.items.cancel.state.form.items.tcolor.state.value',
                bcolor: 'dialogs.auth.state.state.forms.first.items.cancel.state.form.items.bcolor.state.value',
                width: 'dialogs.auth.state.state.forms.first.items.cancel.state.form.items.width.state.value',
                height: 'dialogs.auth.state.state.forms.first.items.cancel.state.form.items.height.state.value'
              }
            },
            no: {
              html: 'dialogs.auth.state.state.forms.no.items.html.state.value'
            }
          }
        }
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.auth.visible': false
        }
      }
    ]
    // dialog
    tempState.dialogs.auth = authPage
  }
}
