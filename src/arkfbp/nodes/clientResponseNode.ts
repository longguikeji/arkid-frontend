import { FunctionNode } from 'arkfbp/lib/functionNode'
import Filter from '@/utils/filter'

export class ClientResponseNode extends FunctionNode {
  async run() {
    // 客户端进行响应的必要内容说明
    // client 代表当前页面的 state
    // clientServer 代表需要进行响应的数据映射关系
    // data 代表刚刚请求的返回的数据内容 -- fetch和update时使用
    // type 代表为那种响应类型
    const { client, clientServer } = this.$state.fetch()
    let data = this.inputs
    const type = this.$state.fetch().type

    // start to change
    if (clientServer && client) {
      Object.keys(clientServer).forEach((key) => {
        const ks = key.split('.')
        const len = ks.length
        let temp = client
        for (let i = 0; i < len - 1; i++) {
          const k = ks[i]
          if (k.includes('items[prop=')) {
            const res = Filter(k, temp)
            temp = temp['items'][res]
          } else if (k.includes('columns[prop=')) {
            const col = Filter(k, temp)
            temp = temp['columns'][col]
          } else {
            temp = temp[k]
          }
        }
        // 判断此时的类型内容 -- 之后需要进一步增大兼容性
        if (type === 'fetch') {
          const vs = clientServer[key].split('.')
          let tempS = data
          for (let i = 0; i < vs.length - 1; i++) {
            tempS = tempS[vs[i]]
          }
          temp[ks[len - 1]] = tempS[vs[vs.length - 1]] || tempS
        }
        if (type === 'assign') {
          temp[ks[len - 1]] = clientServer[key]
        }
      })
    }
    return this.inputs
  }
}
