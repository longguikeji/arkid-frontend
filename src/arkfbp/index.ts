import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { Loading } from 'element-ui'
import { cloneDeep } from 'lodash'
import Filter from '@/utils/filter'

const flows = require.context('@/flows', true, /index\.ts$/)
const arkfbpFlows = require.context('@/arkfbp/flows', true, /index\.ts$/)

function getUrl(url: string, data: any, state: any) {
  if (!data) {
    return url
  }

  if (url.indexOf('<') !== -1) {
    const property = url.slice(url.indexOf('<') + 1, url.lastIndexOf('>'))
    return (
      url.slice(0, url.indexOf('<')) + data[property] + url.slice(url.indexOf('>') + 1)
    )
  }
  if (url.indexOf('[') !== -1) {
    const urlParams = url.slice(url.indexOf('[') + 1, url.lastIndexOf(']'))
    let tempState = state
    let tempParams: any
    urlParams.split('.').forEach((v: string) => {
      tempState = tempState[v]
      tempParams = tempState
    })
    return (
      url.slice(0, url.indexOf('[')) + tempParams + url.slice(url.indexOf(']') + 1)
    )
  }

  return url
}

export function runFlowByFile(flowPath: string, inputs: any) {
  let flow: any = {}

  if (flowPath.includes('arkfbp')) {
    flow = arkfbpFlows(flowPath.replace('arkfbp/flows', '.') + '/index.ts')
  } else {
    flow = flows(flowPath.replace('flows', '.') + '/index.ts')
  }
  return runWorkflowByClass(flow.Main, inputs)
}

export async function runAction(action: { flow: string, inputs: any }) {
  if (!action.flow) {
    return
  }
  const loading = Loading.service({ fullscreen: true })
  const flow = action.flow.split('.').join('/')
  const outputs = await runFlowByFile(flow, action.inputs)
  loading.close()
  return outputs
}

export async function runFlow(state: any, flow: any, data: any, router:any) {
  if (flow.type === 'assign') {
    await runAction({
      flow: flow.name,
      inputs: {
        client: state,
        clientServer: flow.client_config
      }
    })

    return
  }

  if (flow.type === 'router') {
    await runAction({
      flow: flow.name,
      inputs: {
        client: state,
        clientServer: flow.request,
        data: data,
        router: router
      }
    })

    return
  }

  if (flow.type === 'api') {
    let params: any = {}
    if (typeof flow.request === 'string') {
      let temp = cloneDeep(state)
      flow.request.split('.').forEach((v: string) => {
        temp = temp[v]
        params = temp
      })
    }

    if (typeof flow.request === 'object') {
      Object.keys(flow.request).forEach(key => {
        let temp = cloneDeep(state)
        const vs = flow.request[key].split('.')
        vs.forEach((v: string) => {
          if (v.includes('items[prop=')) {
            const res = Filter(v, temp)
            temp = temp.items[res]
          } else if (v.includes('columns[prop=')) {
            const res = Filter(v, temp)
            temp = temp.cloumns[res]
          } else {
            temp = temp[v]
          }
        })
        params[key] = temp
      })
    }

    await runAction({
      flow: flow.name,
      inputs: {
        url: `${getUrl(flow.url, data, state)}`,
        method: flow.method,
        params: params,
        client: state,
        clientServer: flow.client_config
      }
    })
    return
  }

  if (flow.type === 'client') {
    let params: any = {}
    if (typeof flow.client_config === 'string') {
      let temp = state
      flow.request.split('.').forEach((v: string) => {
        temp = temp[v]
        params = temp
      })
    }

    if (typeof flow.request === 'object') {
      Object.keys(flow.request).forEach(key => {
        let temp = state
        const vs = flow.request[key].split('.')
        vs.forEach((v: string) => {
          if (v.includes('items[prop=')) {
            const res = Filter(v, temp)
            temp = temp.items[res]
          } else if (v.includes('columns[prop=')) {
            const res = Filter(v, temp)
            temp = temp.cloumns[res]
          } else {
            temp = temp[v]
          }
        })
        params[key] = temp
      })
    }

    await runAction({
      flow: flow.name,
      inputs: {
        url: `${getUrl(flow.url, data, state)}`,
        method: flow.method,
        params: params,
        data: data,
        client: state,
        clientServer: flow.client_config
      }
    })
    return
  }

  let params = state
  if (flow.request) {
    flow.request.split('.').forEach((v: string) => {
      if (v.includes('items[prop=')) {
        const res = Filter(v, params)
        params = params.items[res]
      } else if (v.includes('columns[prop=')) {
        const res = Filter(v, params)
        params = params.cloumns[res]
      } else {
        params = params[v]
      }
    })
  }

  await runAction({
    flow: flow.name,
    inputs: {
      params: params,
      client: data
    }
  })
}
