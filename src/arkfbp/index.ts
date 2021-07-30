import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { stateFilter } from '@/utils/flow'
import getUrl from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'
import { isEmptyObject } from '@/utils/common'
import BaseVue from '@/admin/base/BaseVue'

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
  parent?: string
}

// 根据某个按钮处的 action 配置项（字符串或函数格式--函数格式在BaseVue.ts中直接执行）
// 查找当前 page-state 的 actions 中的以 actionName 为 key 的配置项内容
// 并逐一执行其中的各个流内容
// name某个页面的名称
export async function runFlowByActionName(com: BaseVue, action: string, name?: string) {
  const state = getCurrentPageStateByName(com, name)
  if (!state) return
  const { name: currentPage, actions } = state
  if (!actions) return
  const flows: (IFlow | string)[] = actions[action]
  if (flows?.length) {
    FlowModule.startRunFlow()
    for (let i = 0, l = flows.length; i < l; i++) {
      if (!FlowModule.run) break
      const flow = flows[i]
      if (typeof flow === 'string') {
        if (flow.includes('.')) {
          const fs = flow.split('.')
          const appointedPageActionName = fs[fs.length - 1]
          const appointedPage = fs.slice(0, -1).join('.')
          await runFlowByActionName(com, appointedPageActionName, appointedPage)
        } else {
          await runFlowByActionName(com, flow)
        }
      } else {
        await runFlow(com, state, flow as IFlow, currentPage)
      }
    }
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
async function runFlow (com: any, state: any, flow: IFlow, currentPage: string) {
  const { name: filePath, ...args } = flow
  const data = com.state.selectedData || com.state.data
  if (data) FlowModule.addPageData({ page: currentPage, data })
  const inputs = {
    url: args.url ? getUrl(args.url, currentPage) : undefined,
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

function getCurrentPageStateByName(com: BaseVue, name?: string) {
  let temp = com.$store.state
  let path = com.path.substring(0, com.path.indexOf('.state'))
  path = `${path.replace(/[\[]/g, '.').replace(/[\]]/g, '')}`
  const keys = path.split('.')
  const pageKeys = keys.filter((_, index) => index > 1)
  const mainKeys: string[] = []
  Array.prototype.push.apply(mainKeys, [ keys[0], keys[1], pageKeys.join('.'), 'state' ])
  for (let i = 0; i <= 3; i++) {
    temp = (name && temp[name]) || temp[mainKeys[i]]
  }
  return temp
}