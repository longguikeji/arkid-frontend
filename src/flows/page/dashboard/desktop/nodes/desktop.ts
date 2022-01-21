import { FunctionNode } from 'arkfbp/lib/functionNode'
// import { getSchemaByPath } from '@/utils/schema'
// import generateForm from '@/utils/form'
import OpenAPI, { ITagPageAction } from '@/config/openapi'

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
          options: {},
          endAction: 'keepAppPosition',
          actions: {
            created: [ 'fetch' ],
            fetch: [
              {
                name: 'flows/custom/desktop/fetch',
                url, method
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
            buttons: []
          },
          dialogs: {}
        }
      }
      const desktopState = state[page].state

      // global manage app list
      if (dep.global) {
        const { tag: manageTag } = dep.global.manage
        if (manageTag) {
          const info = OpenAPI.instance.getOnePageTag(manageTag)
          if (info) {
            const { page: manageDep, description: manageDescription, name: manageName } = info
            if (manageDep) {
              const { init: manageInit, local: manageLocal } = manageDep
              desktopState.dialogs[manageName] = {
                page: manageName,
                visible: false
              }
              desktopState.actions = Object.assign(desktopState.actions, {
                openAppManageDialog: [
                  {
                    name: 'arkfbp/flows/assign',
                    response: {
                      [`dialogs.${manageName}.visible`]: true
                    }
                  }
                ]
              })
              desktopState.card.buttons.push(
                {
                  label: manageDescription,
                  action: 'openAppManageDialog',
                  disabled: false,
                  size: 'mini',
                  icon: 'el-icon-edit'
                }
              )
              state[manageName] = {
                type: 'FormPage',
                state: {
                  created: 'created',
                  card: {
                    title: manageDescription
                  },
                  actions: {
                    subscribe: [
                      {
                        name: 'arkfbp/flows/data'
                      },
                      {
                        name: 'flows/custom/desktop/subscribe',
                        url: (manageLocal as ITagPageAction).path,
                        method: (manageLocal as ITagPageAction).method
                      },
                      'desktop.fetch'
                    ]
                  },
                  form: {
                    items: {}
                  }
                }
              }
              const actions = state[page].state.actions
              actions.manage = [
                {
                  name: 'flows/custom/desktop/manage',
                  url: manageInit.path, method: manageInit.method
                }
              ]
              actions.created.push('manage')
            }
          }
        }
      }

      // selectAccount
      // auto fill form browser plugin
      state.selectAccount = {
        type: "List",
        state: {
          title: "选择",
          items: [],
          isActive: true,
          disabled: true
        }
      };
      desktopState.dialogs.selectAccount = {
        visible: false,
        page: "selectAccount"
      };
      desktopState.actions.closeSelectAccountDialog = [
        {
          name: "arkfbp/flows/assign",
          response: {
            "dialogs.selectAccount.visible": false
          }
        }
      ];
      desktopState.actions.openSelectAccountDialog = [
        {
          name: "arkfbp/flows/assign",
          response: {
            "dialogs.selectAccount.visible": true
          }
        }
      ];
      desktopState.actions.selectAccount = [
        {
          name: "flows/custom/desktop/select",
          url: "/api/v1/tenant/{tenant_uuid}/user_app_account/",
          method: "get"
        },
        "openSelectAccountDialog"
      ];
    }
  }
}