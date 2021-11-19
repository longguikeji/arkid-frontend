import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Response extends FunctionNode {
  async run() {
    const results = this.inputs
    const state = this.$state.fetch()
    if (results && results.length) {
      const client = state.inputs.client  
      const items = client.items
      items.length = 0
      for (let i = 0, len = results.length; i < len; i++) {
        const item = results[i]
        items.push({
          type: 'ExtensionPanel',
          state: {
            ...item,
            data: item,
            buttons: item.installed === '已安装' ? [
              {
                label: `编辑`,
                action: 'openUpdateDialog',
                size: 'mini',
                type: 'info'
              },
              {
                label: '卸载',
                action: 'delete',
                size: 'mini',
                type: 'danger'
              }
            ] : [
              {
                label: '点击安装',
                action: 'install',
                size: 'mini',
                type: 'primary'
              }
            ]
          }
        })
      }
    }
  }
}