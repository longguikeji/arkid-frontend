import { FunctionNode } from 'arkfbp/lib/functionNode'

export class DeleteTenant extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state
    const inputSlugPage = {
      type: 'FormPage',
      state: {
        name: `${page}.inputSlug`,
        card: {
          title: '输入当前租户短连接进行验证'
        },
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
        },
        buttons: [
          {
            action: "confirm",
            label: "确认",
            type: "primary"
          }
        ],
        actions: {
          confirm: [
            {
              name: 'flows/custom/tenant/inputSlug',
              request: {
                slug: 'form.items.slug.state.value'
              }
            },
            pageState.actions.delete[1],
            {
              name: 'flows/common/logout'
            }
          ]
        }
      }
    }
    pageState.dialogs!.inputSlug = {
      visible: false,
      page: `${page}.inputSlug`
    }
    state[`${page}.inputSlug`] = inputSlugPage
    pageState.actions.delete = [
      {
        name: 'arkfbp/flows/data'
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.inputSlug.visible': true
        }
      }
    ]
  }
}
