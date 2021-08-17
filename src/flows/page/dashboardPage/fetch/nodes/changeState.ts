import { FunctionNode } from 'arkfbp/lib/functionNode'
import { UserModule } from '@/store/modules/user'
import DashboardItemState from '@/admin/DashboardPage/DashboardItem/DashboardItemState'

export class ChangeState extends FunctionNode {
  async run() {
    const { client } = this.$state.fetch()
    const apps = this.inputs.results // apps
    if (apps?.length === 0) return
    UserModule.setUserApps(apps)
    let x = 0, y = 0
    client.items = []
    apps.forEach((app, index) => {
      y = Math.floor(index / 4)
      const item: DashboardItemState = {
        type: 'CardPanel',
        state: {
          img: app.logo,
          name: app.name,
          url: app.url,
          description: app.description,
          uuid: app.uuid
        },
        position: {
          x: x,
          y: y,
          w: 2,
          h: 1
        }
      }
      if (x >= 6) {
        x = 0
      } else {
        x = x + 2
      }
      client.items.push(item)
    })
    return this.inputs
  }
}
