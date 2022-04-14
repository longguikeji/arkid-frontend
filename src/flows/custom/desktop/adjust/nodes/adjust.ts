import { APINode } from '@/arkfbp/nodes/apiNode'
import { TenantModule } from '@/store/modules/tenant'

export class AdjustDashboardNode extends APINode {
  async run() {
    const uuid = TenantModule.currentTenant.uuid
    const items = this.inputs?.client?.items
    if (!uuid || !items?.length) return

    // 记录桌面应用的位置信息
    this.url = `/api/v1/tenant/${uuid}/user_app_data/`
    this.method = 'PUT'
    const data = new Array()
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i].state
      data.push(item.uuid)
    }
    this.params = { data }
    await super.run()
  }
}
