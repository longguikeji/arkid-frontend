import { getSchemaByPath } from '@/utils/schema'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import OpenAPI, { ISchema } from '@/config/openapi'

// 通过path和method在openAPI中进行
// target为空或'dialogs.create.state.state.'的形式的内容
export default function generateAction(path: string, method: string, target: string, isResponse: boolean) {
  let response = {},
      request = {}
  const schema = getSchemaByPath(path, method)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectTarget = `${target}select.value`
    if (isResponse) {
      response[selectTarget] = {
        value: propertyName
      }
    } else {
      request[propertyName] = {
        value: selectTarget
      }
    }
    Object.keys(schema.discriminator.mapping).forEach(key => {
      const itemTarget = `${target}forms[${key}].items.`
      const itemRef = schema.discriminator!.mapping[key]
      const itemSchema = OpenAPI.instance.getSchemaByRef(itemRef)
      const items = itemSchema.properties
      if (isResponse) {
        response[selectTarget][key] = {}
        generateItemResponseMapping(response[selectTarget][key], items, itemTarget)
      } else {
        request[propertyName][key] = {}
        generateItemRequestMapping(request[propertyName][key], items, itemTarget)
      }
    })
  } else {
    const items = schema.properties
    const itemTarget = `${target}form.items.`
    if (isResponse) {
      generateItemResponseMapping(response, items, itemTarget)
    } else {
      generateItemRequestMapping(request, items, itemTarget)
    }
  }
  return isResponse ? response : request
}

export function generateItemResponseMapping(response: any, items: { [propertyName: string]: ISchema } | undefined, target: string, responsePrefix?: string) {
  if (!items) return
  Object.keys(items).forEach(key => {
    if (items[key].type === 'object') {
      const objectTarget = `${target}${key}.state.items.`
      const objectItems = items[key].properties
      generateItemResponseMapping(response, objectItems, objectTarget, key)
    } else if (items[key].allOf?.length || items[key].oneOf?.length) {
      const item = items[key]
      const ref = item.allOf?.length ? item.allOf[0].$ref : item.oneOf![0].$ref
      const objectSchema = OpenAPI.instance.getSchemaByRef(ref!)
      const objectTarget = `${target}${key}.state.items.`
      const objectItems = objectSchema.properties
      generateItemResponseMapping(response, objectItems, objectTarget, key)
    } else {
      const statePoint = `${target}${key}.state.value`
      response[statePoint] = responsePrefix ? `${responsePrefix}.${key}` : key
    }
  })
}

export function generateItemRequestMapping(request: any, items: { [propertyName: string]: ISchema } | undefined, target: string) {
  if (!items) return
  Object.keys(items).forEach(key => {
    if (items[key].type === 'object') {
      const objectTarget = `${target}${key}.state.items.`
      const objectItems = items[key].properties
      request[key] = {}
      const objectRequest = request[key]
      generateItemRequestMapping(objectRequest, objectItems, objectTarget)
    } else if (items[key].allOf?.length || items[key].oneOf?.length) {
      const item = items[key]
      const ref = item.allOf?.length ? item.allOf[0].$ref : item.oneOf![0].$ref
      const objectSchema = OpenAPI.instance.getSchemaByRef(ref!)
      const objectTarget = `${target}${key}.state.items.`
      const objectItems = objectSchema.properties
      request[key] = {}
      const objectRquest = request[key]
      generateItemRequestMapping(objectRquest, objectItems, objectTarget)
    } else {
      request[key] = `${target}${key}.state.value`
    }
  })
}