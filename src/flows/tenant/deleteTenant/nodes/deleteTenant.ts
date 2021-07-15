import { FunctionNode } from 'arkfbp/lib/functionNode'

export class DeleteTenant extends FunctionNode {
  async run() {
    const state = this.inputs.state.state
    const { actions, dialogs } = state
    actions.confirmDelete = []
    Array.prototype.push.apply(actions.confirmDelete, [
      {
        name: 'flows/tenant/inputSlug',
        request: {
          slug: 'dialogs.inputSlug.state.state.form.items.slug.state.value'
        }
      },
      actions.delete[0],
      {
        name: 'flows/common/logout'
      }
    ])
    dialogs.inputSlug = {
      visible: false,
      title: "输入短连接标识",
      buttons: [
        {
          action: "confirmDelete",
          label: "确认",
          type: "primary"
        }
      ],
      state: {
        type: 'FormPage',
        state: {
          form: {
            items: {
              slug: {
                label: '短连接标识',
                prop: 'slug',
                type: 'Input',
                state: {
                  value: '',
                  placeholder: '请输入短连接标识'
                }
              }
            }
          }
        }
      }
    }
    actions.delete.length = 0
    actions.delete.push({
      name: 'arkfbp/flows/assign',
      response: {
        'dialogs.inputSlug.visible': true
      }
    })
  }
}
