import { FunctionNode } from 'arkfbp/lib/functionNode'

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
          items: [],
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
                name: "arkfbp/flows/assign",
                response: {
                  'dialogs.manager.visible': false
                }
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
      // state[page] = {
      //   type: 'List',
      //   state: {
      //     title: description,
      //     items: [],
      //     created: 'created',
      //     actions: {
      //       created: [ 'fetch' ],
      //       fetch: [
      //         {
      //           name: 'arkfbp/flows/list',
      //           url, method
      //         }
      //       ]
      //     }
      //   }
      // }
      if (!state.notice) {
        state.notice = {
          type: 'Notice',
          state: {}
        }
      }
      const noticeState = state.notice.state
      noticeState[page] = {
        title: description,
        items: [],
        created: 'created',
        actions: {
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'arkfbp/flows/list',
              url, method
            }
          ]
        }
      }
    }
  }

}