import { APINode } from '@/arkfbp/nodes/apiNode'

export class StatisticsNode extends APINode {

  async run() {
    const { state, dep } = this.inputs
    if (dep && dep.init) {
      const { path: url, method } = dep.init
      this.url = url
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
                items: data
              }
            }
          } else {
            state[key] = {
              type: 'DashboardPage',
              state: {
                card: {
                  title: `${text} - ${subtext}`,
                },
                items: [
                  {
                    type: 'Chart',
                    state: item,
                    position: {
                      x: 1,
                      y: 1,
                      w: 12,
                      h: 3,
                      i: 0
                    }
                  }
                ]
              }
            }
          }
        }
      }
      state.pages = _pages
    }
  }

}