import { FunctionNode } from 'arkfbp/lib/functionNode'
import DashboardItemState from '@/admin/DashboardPage/DashboardItem/DashboardItemState'

export class ChangeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch()
    const apps = this.inputs.data.results // apps
    let x = 0, y = 0
    state.client.items = []
    apps.forEach((app, index) => {
      y = Math.floor(index / 4)
      const item: DashboardItemState = {
        type: 'CardPanel',
        state: {
          img: app.logo,
          name: app.name,
          url: app.url,
          description: app.description
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
      state.client.items.push(item)
    })
    return this.inputs
  }
}
