import { getSchemaByPath } from '@/utils/schema'
import OpenAPI, { ISchema } from '@/config/openapi'

// 通过path和method在openAPI中进行
// target为空或'dialogs.create.state.state.'的形式的内容
export default function generateAction(path: string, method: string, target: string, isResponse: boolean, isEmpty?: boolean) {
  let response = {},
      request = {},
      required: string[] = []
  const schema = getSchemaByPath(path, method)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectTarget = `${target}select.value`
    if (isResponse) {
      response[selectTarget] = {
        value: isEmpty ? '' : propertyName
      }
    } else {
      request[propertyName] = {
        value: isEmpty ? '' : selectTarget
      }
    }
    Object.keys(schema.discriminator.mapping).forEach(key => {
      const itemTarget = `${target}forms[${key}].items.`
      const itemRef = schema.discriminator!.mapping[key]
      const itemSchema = OpenAPI.instance.getSchemaByRef(itemRef)
      const items = itemSchema.properties
      filterReuqiredItems(itemSchema, required)
      if (isResponse) {
        response[selectTarget][key] = {}
        generateItemResponseMapping(response[selectTarget][key], items, itemTarget, '', propertyName, isEmpty)
      } else {
        request[propertyName][key] = {}
        generateItemRequestMapping(request[propertyName][key], items, itemTarget)
      }
    })
  } else {
    filterReuqiredItems(schema, required)
    const items = schema.properties
    const itemTarget = `${target}form.items.`
    if (isResponse) {
      generateItemResponseMapping(response, items, itemTarget, '', '', isEmpty)
    } else {
      generateItemRequestMapping(request, items, itemTarget)
    }
  }
  return {
    mapping: isResponse ? response : request,
    required: required
  }
}

export function generateItemResponseMapping(response: any, items: { [propertyName: string]: ISchema } | undefined, target: string, responsePrefix?: string, skipProp?: string, isEmpty?: boolean) {
  if (!items) return
  const keys = Object.keys(items)
  for (const key of keys) {
    if (key === skipProp) {
      continue
    }
    const item = items[key]
    if (item.allOf?.length || item.oneOf?.length || item.type === 'object') {
      const objectTarget = `${target}${key}.state.items.`
      const objectItems = getObjectItems(item)
      if (objectItems) {
        generateItemResponseMapping(response, objectItems, objectTarget, key, '', isEmpty)
      } else {
        const statePoint = `${target}${key}.state.value`
        response[statePoint] = isEmpty ? '' : ( responsePrefix ? `${responsePrefix}.${key}` : key )
      }
    } else {
      const statePoint = `${target}${key}.state.value`
      response[statePoint] = isEmpty ? '' : ( responsePrefix ? `${responsePrefix}.${key}` : key )
    }
  }
}

export function generateItemRequestMapping(request: any, items: { [propertyName: string]: ISchema } | undefined, target: string) {
  if (!items) return
  Object.keys(items).forEach(key => {
    const item = items[key]
    if (item.allOf?.length || item.oneOf?.length || item.type === 'object') {
      const objectTarget = `${target}${key}.state.items.`
      const objectItems = getObjectItems(item)
      if (objectItems) {
        request[key] = {}
        const objectRquest = request[key]
        generateItemRequestMapping(objectRquest, objectItems, objectTarget)
      } else {
        request[key] = `${target}${key}.state.value`
      }
    } else {
      request[key] = `${target}${key}.state.value`
    }
  })
}

export function getObjectItems(item: ISchema) {
  const refOf = item.allOf || item.oneOf
  let objectItems = item.properties
  if (refOf?.length) {
    const ref = refOf[0].$ref
    const objectSchema = OpenAPI.instance.getSchemaByRef(ref!)
    objectItems = objectSchema.properties
  }
  return objectItems
}

export function filterReuqiredItems(schema: ISchema, required: string[]) {
  if (schema.required && schema.properties) {
    const items = schema.properties
    required = schema.required.filter(prop => {
      const item = items[prop]
      if (!item.readOnly && (item.allOf || item.oneOf)) {
        debugger
      } else { 
        return !item.readOnly
      }
    })
  }
}
