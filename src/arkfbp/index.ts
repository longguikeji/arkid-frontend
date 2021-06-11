import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { getCurrentPageState } from '@/utils/get-page-state'
import Filter from '@/utils/filter'
import getUrl from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'

export interface IFlow {
  name: string
  url?: string
  method?: string
  request?: any
  response?: any
  target?: string // 配置jump时跳转的目标页面
  path?: string // 用于组件之间的指向
  required?: Array<string>
}

// 根据某个按钮处的 action 配置项（字符串或函数格式--函数格式在BaseVue.ts中直接执行）
// 查找当前 page-state 的 actions 中的以 actionName 为 key 的配置项内容
// 并逐一执行其中的各个流内容
export async function runFlowByActionName(com: any, actionName: string, appointedPath?: string) {
  const path = appointedPath || com.path
  const baseState = com.$store.state
  const currentPageState = getCurrentPageState(baseState, path)
  if (!currentPageState?.actions) {  
    return
  }
  const currentFlows: (IFlow | string)[] = currentPageState.actions[actionName]
  if (currentFlows?.length) {
    FlowModule.startRunFlow()
    for (let i = 0; i < currentFlows.length; i++) {
      if (!FlowModule.run) break
      if (typeof currentFlows[i] === 'string') {
        const appointedFlow = currentFlows[i] as string
        if (appointedFlow.includes('.')) {
          const appointedActionMapping = appointedFlow.split('.')
          const appointedActionName = appointedActionMapping[appointedActionMapping.length - 1]
          await runFlowByActionName(com, appointedActionName, appointedFlow)
        } else {
          await runFlowByActionName(com, appointedFlow)
        }
      } else {
        await runFlow(com, currentPageState, currentFlows[i] as IFlow)
      }
    }
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
export async function runFlow (com: any, state: any, flow: IFlow) {
  const { name: filePath, ...args } = flow
  const data = com.state?.selectedData || com.state?.data
  const inputs = {
    url: args.url ? getUrl(args.url, data) : '',
    method: args.method?.toUpperCase(),
    params: {},
    client: state,
    clientServer: args.response,
    target: args.target,
    path: args.path,
    com: com,
    required: args.required
  }
  // 对 request 请求参数进行解析处理
  if (args.request) {
    const mapping = stateMappingProxy(state, args.request)
    inputs.params = parseStateMapping(state, mapping)
  }
  await runFlowByFile(filePath, inputs)
}

// 使用 arkfbp-javascript 执行配置中的流内容 
// arkfbp-javascript: https://github.com/longguikeji/arkfbp-javascript
export async function runFlowByFile(flowPath: string, inputs: any) {
  if (!flowPath) {
    return
  }
  if (/^(@\/)/.test(flowPath)) {
    flowPath = flowPath.slice(2)
  }
  const flow = await import(`@/${flowPath}`)
  const outputs = await runWorkflowByClass(flow.Main, inputs)
  return outputs
}

// 对Mapping进行一次二次处理
export function stateMappingProxy(state: any, mapping: any) {
  Object.keys(mapping).forEach(key => {
    const m = mapping[key]
    if (typeof m === 'object') {
      if (m.value) {
        let selectItemsObject = {}
        const selectValMapping = m.value
        const val = getStateByStringConfig(state, selectValMapping)
        selectItemsObject = m[val]
        selectItemsObject[key] = selectValMapping
        mapping[key] = undefined
        Object.assign(mapping, selectItemsObject)
      } else if (m.key && m.data) {
        const data = getStateByStringConfig(state, m.data)
        mapping[key] = []
        data.forEach(d => {
          if (d[m.key]) {
            mapping[key].push(d[m.key])
          }
        })
      }
    }
  })
  return mapping
}

// 对配置项中的 request 或者 response 进行配置解析
// 参数说明
// state: current page state
// mapping: request or response config
export function parseStateMapping(state: any, mapping: any) {
  let params = {}
  Object.keys(mapping).forEach(key => {
    let tempState
    const item = mapping[key]
    if (typeof item === 'string') {
      tempState = getStateByStringConfig(state, item)
      if (tempState) {
        params[key] = tempState
      }
    } else if (typeof item === 'object') {
      const objectData = parseStateMapping(state, item)
      params[key] = { ...objectData }
    } else {
      params[key] = item
    }
  })
  return params
}

export function getStateByStringConfig(state: any, str: string) {
  let tempState = state
  if (str.includes('forms[')) {
    const value = str.slice(str.indexOf('[') + 1, str.indexOf(']'))
    str = str.slice(0, str.indexOf('[')) + '.' + value + str.slice(str.indexOf(']') + 1)
  }
  const strMapping = str.split('.')
  if (strMapping.length) {
    strMapping.forEach(sm => {
      if (sm.includes('columns[prop=')) {
        const res = Filter(sm, tempState)
        tempState = tempState.cloumns[res]
      } else {
        if (tempState[sm] || (!tempState[sm] && sm === 'value')) {
          tempState = tempState[sm]
        } else {
          tempState = str
        }
      }
    })
  }
  return tempState
}
