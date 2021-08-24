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

  initStatement() {
    const { url, page } = this.inputs
    if (!url) throw new Error('is a valid url')
    this._url = url
    this._data = FlowModule.data
    if (page) {
      this._pages = page.split('.')
      this._page = page
    }
  }

  condition() {
    return this._url.includes('{')
  }

  process() {
    const paramKey = this._url.slice(this._url.indexOf('{') + 1, this._url.indexOf('}'))
    let value: string | undefined = undefined
    switch (paramKey) {
      case 'parent_lookup_user':
        value = UserModule.uuid
        break
      case 'token':
        value = getToken() || ''
        break
      default:
        value = TenantModule.currentTenant.uuid || paramKey
    }
    if (value !== paramKey) this._url = this._url.slice(0, this._url.indexOf('{')) + value + this._url.slice(this._url.indexOf('}') + 1)
    if (this._page && this._page !== 'desktop' && !isEmpty(this._data)) {
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
