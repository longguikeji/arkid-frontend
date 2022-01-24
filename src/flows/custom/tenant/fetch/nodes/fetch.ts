import { APINode } from '@/arkfbp/nodes/apiNode'
import { dateParser } from '@/utils/common'

export class TenantFetch extends APINode {
  async run() {
    const { url, method, params, client } = this.inputs
    this.url = url
    this.method = method
    this.params = params
    const outputs = await super.run()
    if (outputs) {
      const { count, results } = outputs
      if (results && results.length) {
        const list = client.items
        client.pagination.total = count
        list.length = 0
        for (const item of results) {
          list.push({
            type: 'CardPanel',
            state: {
              name: item.name,
              logo: item.icon,
              // description: dateParser(item.created, 'YYYY-MM-DD HH:mm:ss'),
              tags: [ { label: '角色', value: item.role } ],
              action: 'switch',
              data: item
            }
          })
        }
      }
    }
  }
}