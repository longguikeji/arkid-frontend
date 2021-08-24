import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitCustomFieldsNode extends FunctionNode {
    async run() {
      const data = this.inputs
      const items = {}
      if (data.results) {
        data.results.forEach(item => {
          const name = item.name
          if (name) {
            items[name] = {
              label: name,
              prop: name,
              type: 'Input',
              state: {
                value: '',
                placeholder: `请输入${name}`
              }
            }
          }
        })
      }
      return items
    }
}
