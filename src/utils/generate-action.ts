import { getSchemaByPath } from '@/utils/schema'
import OpenAPI, { ISchema } from '@/config/openapi'

// 通过path和method在openAPI中进行
// target为空或'dialogs.create.state.state.'的形式的内容
export function getActionMapping(path: string, method: string, target: string, blank?: boolean) {
  let mapping = {}, required
  const mappingWay = method.toUpperCase() === 'GET' ? 'response' : 'request'
  const schema = getSchemaByPath(path, method)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectTarget = `${target}select.value`
    required = { [ propertyName ]: {} }
    const selectRequired = required[propertyName]
    if (mappingWay === 'response') {
      mapping[selectTarget] = { value: blank ? '' : propertyName }
    } else {
      mapping[propertyName] = { value: blank ? '' : selectTarget }
    }
    Object.keys(schema.discriminator.mapping).forEach(key => {
      const discriminatorTarget = `${target}forms.${key}.items.`
      const discriminatorRef = schema.discriminator!.mapping[key]
      const discriminatorSchema = OpenAPI.instance.getSchemaByRef(discriminatorRef)
      const props = discriminatorSchema.properties
      selectRequired[key] = filterReuqiredItems(discriminatorSchema)
      if (mappingWay === 'response') {
        mapping[selectTarget][key] = {}
      } else {
        mapping[propertyName][key] = {}
      }
      for (const prop in props) {
        if (prop === propertyName) continue
        const item = props[prop]
        if (mappingWay === 'response') {
          getResponseMapping(prop, item, mapping[selectTarget][key], discriminatorTarget, blank)
        } else {
          getRequestMapping(prop, item, mapping[propertyName][key], discriminatorTarget)
        }
      }
    })
  } else {
    required = filterReuqiredItems(schema)
    const props = schema.properties
    const propTarget = `${target}form.items.`
    for (const prop in props) {
      const item = props[prop]
      if (mappingWay === 'response') {
        getResponseMapping(prop, item, mapping, propTarget, blank)
      } else {
        getRequestMapping(prop, item, mapping, propTarget)
      }
    }
  }
  return { mapping, required }
}

// prop为元素属性值，相当于name
// schema表示当前数据项在OpenAPI中的描述信息
// response指的是生成的response响应体映射信息
// target表示当前response指向那个Vue-Component内容，并最终去给该组件的vaule进行赋值
// prefix可以支持复杂响应体信息的获取
function getResponseMapping(prop: string, schema: ISchema, response: any, target: string, blank: boolean = false, prefix: string = '') {
  if (schema.type === 'object') {
    const objectMapping = `${target}value`
    response[objectMapping] = blank ? '' : ( prefix !== '' ? `${prefix}.${prop}` : prop )
  } else if (schema.allOf?.length || schema.oneOf?.length) {
    const dataSchema = getObjectSchema(schema)
    const dataMapping = `${target}${prop}.state.`
    if (dataSchema) {
      getResponseMapping(prop, dataSchema, response, dataMapping, blank)
    }
  } else {
    const stateMapping = `${target}${prop}.state.value`
    response[stateMapping] = blank ? '' : ( prefix !== '' ? `${prefix}.${prop}` : prop )
  }
}

// prop为元素属性值，相当于name
// schema表示当前数据项在OpenAPI中的描述信息
// request指的是生成的request请求体映射信息
// target表示当前request指向那个Vue-Component内容，并最终去读取该组件的vaule
function getRequestMapping(prop: string, schema: ISchema, request: any, target: string) {
  if (schema.type === 'object') {
    request[prop] = `${target}value`
  } else if (schema.allOf?.length || schema.oneOf?.length) {
    const dataSchema = getObjectSchema(schema)
    const dataMapping = `${target}${prop}.state.`
    if (dataSchema) {
      getRequestMapping(prop, dataSchema, request, dataMapping)
    }
  } else {
    request[prop] = `${target}${prop}.state.value`
  }
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
          required[r] = objRequired
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
