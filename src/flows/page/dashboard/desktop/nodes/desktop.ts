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
    }

    if (page === 'notice') {
      state[page] = {
        type: 'List',
        state: {
          header: {
            title: description
          },
          items: [
            {
              label: '1. 欢迎使用ArkID一账通',
              value: '1',
              badge: {
                value: 'new'
              }
            },
            {
              label: '2. 有关任何问题，欢迎留言',
              value: 'https://github.com/longguikeji/arkid/issues',
              type: 'link'
            },
            {
              label: '3. ArkID简介',
              type: 'detail',
              value: '一账通是一款开源的统一身份认证授权管理解决方案，支持多种标准协议(LDAP, OAuth2, SAML, OpenID)，细粒度权限控制，完整的WEB管理功能，钉钉、企业微信集成等'
            }
          ]
        }
      }
    }

    if (page === 'backlog') {
      state[page] = {
        type: 'List',
        state: {
          header: {
            title: description
          },
          items: [
            {
              label: '1. 查阅开发进度',
              value: 'https://github.com/longguikeji/arkid/projects',
              type: 'link'
            }
          ]
        }
      }
    }
  }

}