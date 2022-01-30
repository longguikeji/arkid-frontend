import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { stateFilter } from '@/utils/flow'
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
}

// actionName 操作名称，为了执行当前 actions 中的该动作
// pageName 页面名称，为了查找某个页面的state选项，以便执行其中的actions内容
// previous 上一个流操作的结果，有时可能在下一个流操作中使用到
export async function runFlowByActionName(com: any, action: string, previous?: any) {
  let page = com.page
  const index = action.indexOf('.')
  if (index !== -1) {
    const lastIndex = action.lastIndexOf('.')
    page = action.substring(0, lastIndex)
    action = action.substring(lastIndex + 1)
  }
  if (page) {
    const state = index !== -1 ? com.getAnyPageState(page) : (com.state.actions ? com.state : com.getAnyPageState(page))
    const actions = state.actions
    const flows = actions && actions[action]
    if (flows && flows.length > 0) {
      FlowModule.startRunFlow()
      for (let i = 0, l = flows.length; i < l; i++) {
        if (!FlowModule.run) break
        const flow = flows[i]
        if (typeof flow === 'string') {
          await runFlowByActionName(com, flow, previous)
        } else {
          previous = await runFlow(com, state, flow as IFlow, page, previous)
        }
      }
    }
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
async function runFlow (com: any, state: any, flow: IFlow, page: string, previous?: any) {
  const { name: filePath, ...args } = flow
  const data = com.state.node || com.state.data
  const { url, method, response, target, required, path } = args
  const inputs = {
    url: url,
    method: method?.toUpperCase(),
    params: {},
    client: state,
    clientServer: response,
    target,
    com,
    required,
    path,
    data,
    page,
    previous
  }
  // 对 request 请求参数进行解析处理
  if (args.request && !isEmptyObject(args.request)) {
    const mapping = stateMappingProxy(state, args.request)
    inputs.params = parseStateMapping(state, mapping)
  }
  return await runFlowByFile(filePath, inputs)
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
function stateMappingProxy(state: any, mappings: any) {
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
function parseStateMapping(state: any, mapping: any) {
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

function getStateByStringConfig(state: any, str: string) {
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