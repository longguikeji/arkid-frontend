import { APINode } from '@/arkfbp/nodes/apiNode'
import { TenantModule } from '@/store/modules/tenant'

export class StatisticsNode extends APINode {

  async run() {
    const { state, dep } = this.inputs
    if (dep && dep.init) {
      const { path: url, method } = dep.init
      const uuid = TenantModule.currentTenant.uuid
      this.url = url.replace(/(\{parent_lookup_tenant\}|\{tenant_uuid\})/g, uuid)
      this.method = method
      const outputs = await super.run()
      const _pages: string[] = []
      if (outputs) {
        for (let i = 0, l = outputs.length; i < l; i++) {
          const item = outputs[i]
          const type = item.type || 'chart'
          const key = `${type}${i}`
          _pages.push(key)
          const { title, data } = item
          const { text, subtext } = title
          if (item.type === 'list') {
            state[key] = {
              type: 'List',
              state: {
                header: {
                  title: `${text} - ${subtext}`,
                },
                items: data.map(d => { return { value: d, label: d } })
              }
            }
          } else {
            state[key] = {
              type: 'Chart',
              state: {
                title: `${text} - ${subtext}`,
                options: item
              }
            }
          }
        }
      }
      state.pages = _pages
    }
  }

}