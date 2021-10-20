import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'
import { getToken } from '@/utils/auth'

export class UrlNode extends FunctionNode {

  private _url: string = ''
  private _pages: string[] = []
  private _page: string = ''
  private _uuid: string = ''
  private _com: any = null
  private _count: number = 0

  initStatement() {
    const { url, page, com } = this.inputs
    if (!url) throw new Error('is a valid url')
    this._url = url
    this._uuid = TenantModule.currentTenant.uuid || ''
    this._com = com
    const reg = new RegExp('{', 'g')
    const res = url.match(reg)
    this._count = res ? res.length : 0
    if (page) {
      const pages = page.split('.')
      let name = ''
      pages.forEach((p: string) => {
        name = `${name}${p}`
        this._pages.push(name)
        name = `${name}.`
      })
      this._page = page
    }
  }

  condition() {
    return this._url.includes('{') || this._count === 0
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
    if (this._url.includes('{')) {
      for (let i = 0, len = this._pages.length; i < len; i++) {
        if (!this._url.includes('{')) break
        const page = this._pages[i]
        const state = this._com.getAnyPageState(page)
        const data = state.data
        this._url = this._url.slice(0, this._url.indexOf('{')) + data?.uuid + this._url.slice(this._url.indexOf('}') + 1) 
      }
    }
    this._count = this._count - 1
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
