import { FunctionNode } from 'arkfbp/lib/functionNode'
import { UserModule } from '@/store/modules/user'
import DashboardItemState from '@/admin/DashboardPage/DashboardItem/DashboardItemState'

export class ChangeState extends FunctionNode {
  async run() {
    const { client, results: apps, items } = this.$state.fetch()
    UserModule.setUserApps(apps)
    let x = 0, y = 0
    apps.forEach((app, index) => {
      y = Math.floor(index / 4)
      const position = items.filter(item => item.uuid === app.uuid)[0]
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
          x: position ? position.x : x,
          y: position ? position.y : y,
          w: position ? position.w : 2,
          h: position ? position.h : 1,
          i: position ? position.i : index
        }
      }
      if (x >= 6) {
        x = 0
      } else if (position?.x === undefined) {
        x = x + 2
      }
      client.items.push(item)
    })
  }
}
