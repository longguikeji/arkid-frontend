import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Extension extends FunctionNode {
  async run() {
    const { state, page, dep, options } = this.inputs
    const { init, local } = dep
    state[page] = {
      type: 'DashboardPage',
      state: {
        created: 'created',
        options: {
          disabled: true,
        },
        card: {
          title: options.description
        },
        items: [],
        dialogs: {},
        actions: {
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'flows/custom/extension/response',
              url: init.path,
              method: init.method,
            }
          ]
        }
      }
    }
    if (local) {
      const { install: i, update: u, delete: d } = local
      const { actions, dialogs } = state[page].state
      actions.install = [
        {
          name: 'flows/custom/extension/install',
          url: i.path,
          method: i.method
        }
      ]
      state._pages_.push(u.tag)
      dialogs.update = {
        visible: false,
        page: u.tag
      }
      actions.openUpdateDialog = [
        {
          name: 'arkfbp/flows/assign',
          response: {
            'dialogs.update.visible': true
          }
        }
      ]
      actions.closeUpdateDialog = [
        {
          name: 'arkfbp/flows/assign',
          response: {
            'dialogs.update.visible': false
          }
        }
      ]
      actions.delete = [
        {
          name: 'arkfbp/flows/update',
          url: d.path, method: d.method
        }
      ]
    }
  }
}