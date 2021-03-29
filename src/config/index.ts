import { type } from "os"

export class Config {
  private _current: any = {}
  private _viewconfig: any = {}
  private _serveconfig: any = {}
  private _config: any = {}

  private _serveApi: any = {
    create: [],
    update: [],
    retrieve: [],
    search: [],
    delete: []
  }
  private _serveMeta: any = {}

   constructor(current: string, viewconfig: any, serveconfig: any) {
    this._viewconfig = viewconfig
    this._serveconfig = serveconfig
    this._current = current

    this.getConfig()
  }

  get config(): any {
    return this._config
  }

  private getSrcMeta(params: any) {
    const map: any = {}
    Object.keys(params).forEach((p: any) => {
      if (typeof params[p] === 'object') {
        if (params[p].src.includes('.')) {
          const arr = params[p].src.split('.')
          const data = this._serveconfig[arr[0]].meta[arr[1]]
          map[p] = {
            label: data.title,
            state: {
              value: '',
              ...(Object.values(data.type)[0] as Object)
            }
          }
        }
      } else {
        map[p] = {
          state: {
            value: ''
          }
        }
      }
    })
    return map
  }

  private getSeverApi() {
    const api = this._serveconfig[this._current].api

    if (!api) {
      return
    }

    const getApiMap = (url: string, methed: string, index: any, type: string) => {
      this._serveApi[type].push({
        url: url,
        index,
        method: methed.toUpperCase(),
        label: api[url][methed].name,
        action: type,
        request: this.getSrcMeta(api[url][methed].request)
      })
    }

    Object.keys(api).forEach((url: any) => {
      let index: any = {}
      if (api[url].index) {
        index = this.getSrcMeta(api[url].index)
      }
      Object.keys(api[url]).forEach((methed: any) => {
        if(url.includes('id') || url.includes('name')) {
          switch (methed) {
            case 'get':
              getApiMap(url, methed, index, 'search')
              break;
            case 'delete':
              getApiMap(url, methed, index, 'delete')
              break;
            case 'patch':
              getApiMap(url, methed, index, 'update')
              break;
            default:
              break;
          }
        } else {
          switch (methed) {
            case 'get':
              getApiMap(url, methed, index, 'retrieve')
              break;
            case 'post':
              getApiMap(url, methed, index, 'create')
              break;
            default:
              break;
          }
        }
      })
    })
  }

  private getSeverMeta() {
    const meta = this._serveconfig[this._current].meta

    if (!meta) {
      return
    }

    const walkMeta = (data: any, name: string, map: any) => {
      const type = data[name].type

      if(name !== this._current) {
        return
      }

      if (type.object) {
        Object.keys(type.object).forEach((e: any) => {
          if (type.object[e].includes('.')) {
            const arr = type.object[e].split('.')
            const value = this._serveconfig[arr[0]].meta[arr[1]]
            map[e] = {
              label: value.title || e,
              state: {
                value: '',
                ...(Object.values(value.type)[0] as Object)
              }
            }
          } else {
            const value = data[type.object[e]]
            map[e] = {
              label: value.title || e,
              state: {
                value: '',
                ...(Object.values(value.type)[0] as Object)
              }
            }
          }
        })
      }
    }

    Object.keys(meta).forEach((e: any) => {
      if(meta[e].type.object) {
        walkMeta(meta, e, this._serveMeta)
      } else {
        Object.keys(meta).forEach((e: any) => {
          const value = meta[e]
  
          this._serveMeta[e] = {
            label: value.title || e,
            state: {
              value: '',
              ...(Object.values(value.type)[0] as Object)
            }
          }
        })
      }
    })
  }

  private getConfig(): any {
    if (!this._viewconfig) {
      this._config = this.initConfig()
    }

    if (!this._serveconfig[this._current]) {
      this._config = this._viewconfig
      return
    }
    
    this.getSeverApi()
    this.getSeverMeta()
    
    Object.keys(this._viewconfig).map((key: string) => {
      switch (key) {
        case 'card':
          this._config[key] = this._viewconfig[key]
          break;
        case 'filter':
          this._config[key] = this._viewconfig[key]
          this._config[key].items = this._viewconfig[key].items.map((e: any) => {
            if (typeof e === 'string') {
              return { prop: e, type: 'Input', ...this._serveMeta[e] }
            } else {
              return { ...this._serveMeta[e.prop], ...e } 
            }
          })
          break;
        case 'dialogs':
          this._config[key] = this._viewconfig[key]

          Object.keys(this._viewconfig.dialogs).map((dialog: string) => {
            if(this._serveApi[dialog]) {
              this._config.dialogs[dialog].items = this._viewconfig.dialogs[dialog].items.map((e: any) => {
                if (typeof e === 'string') {
                  return { prop: e, type: 'Input', ...this._serveApi[dialog][0].request[e] }
                } else {
                  return { ...this._serveApi[dialog][0].request[e.prop], ...e }
                }
              })
            }
          })
          break;
        case 'table':
          this._config[key] = this._viewconfig[key]
          if (this._viewconfig.table.columns) {
            this._config.table.columns = this._viewconfig.table.columns.map((e: any) => {
              return { label: this._serveMeta[e.prop] ? this._serveMeta[e.prop].label : '', ...e }
            })
          }
          break;
        default:
          this._config[key] = this._viewconfig[key]
          break;
      }
    })
  }

  private initConfig(): any {
    const type = this._serveconfig[this._current].type
    const name = this._serveconfig[this._current].name

    return {
      type: `${type.slice(0,1).toUpperCase()}${type.slice(1)}Page`,
      created: {
        actions: [
          'fetch'
        ]
      },
      card: {
        title: `${name}Page`,
        buttons: this._serveApi.create.map((e:any) => {
          return {
            label: e.label,
            action: 'showCreateDialog',
            type: 'primary',
            size: 'small'
          }
        })
      },
      filter: {
        inline: true,
        size: 'mini',
        items: Object.keys(this._serveMeta).map((e: any) => {
          return { prop: e, type: 'Input', ...this._serveApi.retrieve[0].request[e] }
        })
      },
      dialogs: {
        create: {
          titles: '新建',
          items: Object.keys(this._serveApi.create[0].request).map((e: any) => {
            return { prop: e, type: 'Input', ...this._serveApi.create[0].request[e] }
          }),
          actions: [
            {
              label: '确定',
              action: 'submit',
              close: true,
              type: 'primary'
            }
          ],
          visible: false,
          data: {}
        },
        update: {
          titles: '编辑',
          items: Object.keys(this._serveApi.update[0].request).map((e: any) => {
            return { prop: e, type: 'Input', ...this._serveApi.update[0].request[e] }
          }),
          actions: [
            {
              label: '确定',
              action: 'submit',
              close: true,
              type: 'primary'
            }
          ],
          visible: false,
          data: {}
        }
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        background: '',
        action: 'fetch'
      },
      actions: {
        fetch: {
          flows: [
            {
              name: 'arkfbp.flows.fetch',
              type: 'api',
              request: {
                page: 'pagination.currentPage', 
                page_size: 'pagination.pageSize', 
              }, 
              url: this._serveApi.retrieve[0].url, 
              method: this._serveApi.retrieve[0].method,
              client_config: {
                'table.data': 'data.items',
                'pagination.total': 'data.total'
              }
            }
          ]
        },
        showCreateDialog: {
          flows: [
            {
              name: 'arkfbp.flows.assign',
              type: 'assign',
              client_config: {
                'dialogs.create.visible': true
              }
            }
          ]
        },
        showUpdateDialog: {
          flows: [
            {
              name: 'arkfbp.flows.assign',
              type: 'assign',
              client_config: {
                'dialogs.update.visible': true
              }
            },
            {
              name: 'arkfbp.flows.fetch',
              type: 'api',
              method: 'GET',
              url: this._serveApi.get[0].url,
              client_config: {
                'dialogs.update.values': 'data'
              }
            }
          ]
        },
        submit: {
          flows: [
            {
              name: 'arkfbp.flows.update',
              type: 'api',
              method: 'POST',
              url: this._serveApi.update[0].url,
              request: {}
            }
          ]
        },
        delete: {
          flows: [
            {
              name: 'arkfbp.flows.update',
              type: 'api',
              method: 'GET',
              url: this._serveApi.delete[0].url
            }
          ]
        }
      }
    }
  }
}
