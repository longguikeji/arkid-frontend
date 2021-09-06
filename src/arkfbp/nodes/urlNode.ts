import { FunctionNode } from 'arkfbp/lib/functionNode'
import { FlowModule } from '@/store/modules/flow'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import { isEmpty } from 'lodash'

export class UrlNode extends FunctionNode {

  private _url: string = ''
  private _pages: string[] = []
  private _page: string = ''
  private _data: any = null
  private _uuid: string = ''

  initStatement() {
    const { url, page } = this.inputs
    if (!url) throw new Error('is a valid url')
    this._url = url
    this._data = FlowModule.data
    this._uuid = TenantModule.currentTenant.uuid || ''
    if (page) {
      this._pages = page.split('.')
      this._page = page
    }
  }

  condition() {
    return this._url.includes('{')
  }

  process() {
    if (this._url.includes('parent_lookup_user')) {
      this._url = this._url.replace(/\{parent_lookup_user\}/g, UserModule.uuid)
    }
    if (this._url.includes('parent_lookup_tenant') || this._url.includes('tenant_uuid')) {
      this._url = this._url.replace(/(\{parent_lookup_tenant\}|\{tenant_uuid\})/g, this._uuid)
    }
    if (this._page === 'tenant_config' || this._page === 'tenant_config.update') {
      this._url = this._url.replace('{id}', this._uuid)
    }
    if (this._url.includes('token')) {
      const token = getToken()
      if (!token) throw new Error('not token')
      this._url = this._url.replace(/\{token\}/, token)
    }
    if (!this._url.includes('{')) return
    if (!isEmpty(this._data)) {
      let name = this._pages[0]
      for (let i = 0, len = this._pages.length; i < len; i++) {
        if (!this._url.includes('{')) break
        if (this._data[name]) this._url = this._url.slice(0, this._url.indexOf('{')) + this._data[name]?.uuid + this._url.slice(this._url.indexOf('}') + 1)
        name += `.${this._pages[i+1]}`
      }
    }
  }

  async run() {
    this.initStatement()
    while (this.condition()) {
      this.process()
    }
    this.inputs.url = this._url
    return this.inputs
  }

}
