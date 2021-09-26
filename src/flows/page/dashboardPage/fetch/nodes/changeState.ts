import { FunctionNode } from 'arkfbp/lib/functionNode'
import { UserModule } from '@/store/modules/user'
import DashboardItemState from '@/admin/DashboardPage/DashboardItem/DashboardItemState'

export class ChangeState extends FunctionNode {

  async run() {
    const { client, results: apps, items, outputs, page } = this.$state.fetch()
    if (page === 'statistics') {
      outputs.forEach((i, index) => {
        const item = {
          type: 'Chart',
          state: i,
          position: {
            x: index,
            y: 1,
            w: 12,
            h: 2,
            i: index
          }
        }
        client.items.push(item)
      })
    } else {
      UserModule.setUserApps(apps)
      let x = 0, y = 0
      apps.forEach((app, index) => {
        y = Math.floor(index / 4)
        let position = items.filter(item => item.uuid === app.uuid)[0]
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
            w: 1,
            h: 1,
            i: position ? position.i : index
          }
        }
        client.items.push(item)
      })
    }
  }
}
