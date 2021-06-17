import { getSchemaByPath } from '@/utils/schema'
import OpenAPI, { ISchema } from '@/config/openapi'

// 通过path和method在openAPI中进行
// target为空或'dialogs.create.state.state.'的形式的内容
export default function generateAction(path: string, method: string, target: string, isResponse: boolean, isEmpty?: boolean) {
  let response = {},
      request = {},
      required
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
    required = { [ propertyName ]: {} }
    const objRequired = required[propertyName]
    Object.keys(schema.discriminator.mapping).forEach(key => {
      const itemTarget = `${target}forms[${key}].items.`
      const itemRef = schema.discriminator!.mapping[key]
      const itemSchema = OpenAPI.instance.getSchemaByRef(itemRef)
      const items = itemSchema.properties
      objRequired[key] = filterReuqiredItems(itemSchema)
      if (isResponse) {
        response[selectTarget][key] = {}
        generateItemResponseMapping(response[selectTarget][key], items, itemTarget, '', propertyName, isEmpty)
      } else {
        request[propertyName][key] = {}
        generateItemRequestMapping(request[propertyName][key], items, itemTarget)
      }
    })
  } else {
    required = filterReuqiredItems(schema)
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
  const objectSchema = getObjectSchema(item)
  const objectItems = objectSchema?.properties
  return objectItems
}

export function getObjectSchema(item: ISchema) {
  const refOf = item.allOf || item.oneOf
  if (refOf?.length) {
    const ref = refOf[0].$ref
    const objectSchema = OpenAPI.instance.getSchemaByRef(ref!)
    return objectSchema
  } else {
    return null
  }
}

export function filterReuqiredItems(schema: ISchema) {
  let required: any[] = []
  if (schema.required && schema.properties) {
    const items = schema.properties
    schema.required.forEach(r => {
      const item = items[r]
      if (!item.readOnly && (item.allOf || item.oneOf)) {
        const objSchema = getObjectSchema(item)
        if (objSchema) {
          const objRequired = filterReuqiredItems(objSchema)
          required.push({
            [r]: objRequired
          })
        }
      } else {
        if (!item.readOnly) {
          required.push(r)
        }
      }
    })
  }
  return required
}
