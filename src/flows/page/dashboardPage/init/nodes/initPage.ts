import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitPage extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    if (page === 'statistics') {
      state[page] = {
        type: 'DashboardPage',
        state: {
          created: 'created',
          items: [],
          actions: {
            created: []
          },
          card: {
            title: '统计图表'
          }
        }
      }
    } else {
      state[page] = {
        type: 'DashboardPage',
        state: {
          created: 'created',
          items: [],
          actions: {
            created: []
          },
          card: {
            title: '应用市集'
          }
        }
      }
      state['notice'] = {
        type: 'List',
        state: {
          header: {
            title: '通知列表'
          },
          items: [
            {
              label: '欢迎来到ArkID',
              value: '1'
            }
          ]
        }
      }
    }
    return this.inputs
  }
}
