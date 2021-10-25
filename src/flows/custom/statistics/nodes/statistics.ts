import { APINode } from '@/arkfbp/nodes/apiNode'

export class StatisticsNode extends APINode {
  async run() {
    const { url, method, client } = this.inputs
    this.url = url
    this.method = method
    const outputs = await super.run()
    const list = client.board.list
    if (outputs && outputs.length > 0) {
      outputs.forEach((item: any) => {
        const { type, data, title } = item
        const text = title ? title.text : ''
        const subtext = title ? title.subtext : ''
        if (type && type === 'list') {
          list.push({
            type: 'List',
            state: {
              title: `${text} - ${subtext}`,
              items: data.map((d: string) => { return { value: d, label: d } }),
              isActive: true,
              disabled: true
            }
          })
        } else {
          list.push({
            type: 'Chart',
            state: item
          })
        }
      })
    }
  }
}
