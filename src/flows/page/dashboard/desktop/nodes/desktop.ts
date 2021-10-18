import { FunctionNode } from 'arkfbp/lib/functionNode'
import { getSchemaByPath } from '@/utils/schema'
import generateForm from '@/utils/form'

export class DesktopNode extends FunctionNode {
  async run() {
    const { state, page, dep, options } = this.inputs
    let url, method, description
    if (dep) {
      const init = dep.init
      url = init.path
      method = init.method
    }
    if (options) {
      description = options.description
    }

    if (page === 'desktop') {
      state[page] = {
        type: 'DashboardPage',
        state: {
          created: 'created',
          board: {
            list: [],
            options: {},
            endAction: 'keepAppPosition'
          },
          actions: {
            created: [ 'fetch' ],
            fetch: [
              {
                name: 'flows/custom/desktop/fetch',
                url, method
              }
            ],
            openAppManagerDialog: [
              {
                name: 'arkfbp/flows/assign',
                response: {
                  'dialogs.manager.visible': true
                }
              }
            ],
            closeAppManagerDialog: [
              {
                name: 'arkfbp/flows/assign',
                response: {
                  'dialogs.manager.visible': false
                }
              }
            ],
            keepAppPosition: [
              {
                name: 'flows/custom/desktop/adjust'
              }
            ]
          },
          card: {
            title: description,
            buttons: [
              {
                label: '管理应用',
                action: 'openAppManagerDialog',
                disabled: false,
                size: 'mini',
                icon: 'el-icon-edit'
              }
            ]
          },
          dialogs: {
            manager: {
              page: 'manager',
              visible: false
            }
          }
        }
      }
      state.manager = {
        type: 'FormPage',
        state: {
          card: {
            title: '管理应用'
          },
          buttons: [
            {
              label: '取消',
              action: 'desktop.closeAppManagerDialog',
              size: 'mini'
            },
            {
              label: '确定',
              action: 'manager',
              size: 'mini',
              type: 'primary'
            }
          ],
          actions: {
            manager: [
              {
                name: 'flows/custom/desktop/manager'
              }
            ]
          },
          form: {
            items: {}
          }
        }
      }
    } else {
      if (!state.notice) {
        state.notice = {
          type: 'Notice',
          state: {}
        }
      }
      const noticeLists = state.notice.state
      const schema = getSchemaByPath(url, method)
      const { form } = generateForm(schema, false, true, false, true)
      noticeLists[page] = {
        created: 'created',
        title: description,
        items: [],
        isActive: true,
        detail: {
          visible: false,
          state: {
            type: 'Descriptions',
            state: {
              items: form ? form.items : undefined,
              border: true,
              column: 1
            }
          }
        },
        actions: {
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'flows/common/list',
              url, method
            }
          ]
        }
      }
    }
  }
}