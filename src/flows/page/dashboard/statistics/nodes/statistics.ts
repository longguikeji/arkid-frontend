import { APINode } from '@/arkfbp/nodes/apiNode'

export class StatisticsNode extends APINode {

  async run() {
    const { state, dep } = this.inputs
    if (dep && dep.init) {
      const { path: url, method } = dep.init
      this.url = url
      this.method = method
      const outputs = await super.run()
      if (outputs) {
        state.$pages = []
        for (let i = 0, l = outputs.length; i < l; i++) {
          const item = outputs[i]
          const type = item.type || 'chart'
          const key = `${type}${i}`
          state.$pages.push(key)
          const { title, data } = item
          const { text, subtext } = title
          if (item.type === 'list') {
            state[key] = {
              type: 'List',
              state: {
                header: {
                  title: `${text}`,
                },
                items: data
              }
            }
          } else {
            state[key] = {
              type: 'Chart',
              state: {
                id: key,
                chart: item,
                card: {
                  title: `${text}`,
                }
              }
            }
          }
        }
      }
    }
  }

}