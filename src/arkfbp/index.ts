import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { getCurrentPageState } from '@/utils/get-page-state'
import { stateFilter } from '@/utils/flow'
import getUrl from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'
import { isEmptyObject } from '@/utils/common'

export interface IFlow {
  name: string
  url?: string
  method?: string
  request?: any
  response?: any
  target?: string // 配置jump时跳转的目标页面
  path?: string // 用于组件之间的指向
  required?: any // 用于验证
  data?: any
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
  const currentPage = com.$route.meta?.page
  const inputs = {
    url: args.url ? getUrl(args.url, data, currentPage) : '',
    method: args.method?.toUpperCase(),
    params: {},
    client: state,
    clientServer: args.response,
    target: args.target,
    path: args.path,
    com: com,
    required: args.required,
    data: data
  }
  // 对 request 请求参数进行解析处理
  if (args.request && !isEmptyObject(args.request)) {
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
export function stateMappingProxy(state: any, mappings: any) {
  let newMapping = {}
  const keys = Object.keys(mappings)
  for (const key of keys) {
    const mapping = mappings[key]
    const mappingType = typeof mapping
    if (mappingType === 'object' && mapping.value) {
      const valueMapping = mapping.value
      const selectValue = getStateByStringConfig(state, valueMapping)
      newMapping = Object.assign(newMapping, { [key]: valueMapping }, { ...mapping[selectValue] })
    } else {
      newMapping[key] = mapping
    }
  }
  return newMapping
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
      if (tempState !== undefined && tempState !== null && tempState !== '') {
        params[key] = tempState
      }
    } else {
      params[key] = item
    }
  })
  return params
}

export function getStateByStringConfig(state: any, str: string) {
  let tempState = state
  const strMapping = str.split('.')
  if (strMapping.length) {
    strMapping.forEach(sm => {
      if (sm.includes('[')) {
        const idx = sm.indexOf('[')
        const firstKey = sm.substring(0, idx)
        const secondKey = stateFilter(sm, tempState)
        tempState = tempState[firstKey][secondKey]
      } else {
        const value = tempState[sm]
        if (value || (!value && sm === 'value')) {
          tempState = value
        } else {
          tempState = str
        }
      }
    })
  }
  return tempState
}
