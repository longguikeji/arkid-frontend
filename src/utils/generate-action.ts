import { getSchemaByPath } from '@/utils/schema'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import { ISchema } from '@/config/openapi'

// 通过path和method在openAPI中进行
export default function generateAction(path: string, method: string, target: string, isResponse: boolean) {
  let response = {},
      request = {}
  const schema = getSchemaByPath(path, method)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectPrefix = target + 'select.value'
    debugger
    if (isResponse) {
      response[selectPrefix]
    }
  } else {
    const items = schema.properties
    if (!items) return
    target = target + 'form.items.'
    if (isResponse) {
      generateItemResponseMapping(response, items, target)
    } else {
      generateItemRequestMapping(request, items, target)
    }
  }
  return isResponse ? response : request
}

export function generateItemResponseMapping(response: any, items: { [propertyName: string]: ISchema }, target: string) {
  Object.keys(items).forEach(key => {
    const statePoint = `${target}${key}.state.value`
    response[statePoint] = key
  })
}

export function generateItemRequestMapping(request: any, items: { [propertyName: string]: ISchema }, target: string) {
  Object.keys(items).forEach(key => {
    request[key] = `${target}${key}.state.value`
  })
}