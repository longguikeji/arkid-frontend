import { FunctionNode } from 'arkfbp/lib/functionNode'
import statistics from '@/config/statistics/index.json'

export class InitPage extends FunctionNode {
  async run() {
    const { state, currentPage } = this.inputs
    if (currentPage === 'statistics') {
      state[currentPage] = statistics
    } else {
      state[currentPage] = {
        type: 'DashboardPage',
        state: {
          name: currentPage,
          created: 'created',
          items: [],
          actions: {
            created: []
          }
        }
      }
    }
    return this.inputs
  }
}
