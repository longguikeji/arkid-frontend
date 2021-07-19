import { getSchemaByPath } from '@/utils/schema'
import OpenAPI, { ISchema } from '@/config/openapi'

// 通过path和method在openAPI中进行
export function getActionMapping(path: string, method: string, blank?: boolean) {
  let mapping = {}, required
  const isResponse = method === 'get' ? true : false
  const schema = getSchemaByPath(path, method)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectTarget = `select.value`
    required = { [ propertyName ]: {} }
    const selectRequired = required[propertyName]
    const selectKeys = Object.keys(schema.discriminator.mapping)
    if (isResponse) {
      const defaultValue = selectKeys.length ? selectKeys[0] : undefined
      mapping[selectTarget] = { value: blank ? (defaultValue !== undefined ? defaultValue : '') : propertyName }
    } else {
      mapping[propertyName] = { value: selectTarget }
    }
    for (const key of selectKeys) {
      const discriminatorTarget = `forms.${key}.items.`
      const discriminatorRef = schema.discriminator!.mapping[key]
      const discriminatorSchema = OpenAPI.instance.getSchemaByRef(discriminatorRef)
      const props = discriminatorSchema.properties
      selectRequired[key] = filterReuqiredItems(discriminatorSchema)
      if (isResponse) {
        mapping[selectTarget][key] = {}
      } else {
        mapping[propertyName][key] = {}
      }
      for (const prop in props) {
        if (prop === propertyName) continue
        const item = props[prop]
        if (isResponse) {
          getResponseMapping(prop, item, mapping[selectTarget][key], discriminatorTarget, blank)
        } else {
          getRequestMapping(prop, item, mapping[propertyName][key], discriminatorTarget)
        }
      }
    }
  } else {
    required = filterReuqiredItems(schema)
    const props = schema.properties
    const propTarget = `form.items.`
    for (const prop in props) {
      const item = props[prop]
      if (isResponse) {
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
function getResponseMapping(prop: string, schema: ISchema, response: any, target: string, blank: boolean = false) {
  const defaultValue = schema.type === 'boolean' ? !!schema.default : schema.default
  if (schema.allOf?.length || schema.oneOf?.length) {
    const dataSchema = getObjectSchema(schema)
    if (dataSchema) {
      getResponseMapping(prop, dataSchema, response, target, blank)
    }
  } else {
    const stateMapping = `${target}${prop}.state.value`
    response[stateMapping] = blank ? ( defaultValue !== undefined ? defaultValue : '' ) : prop
  }
}

// prop为元素属性值，相当于name
// schema表示当前数据项在OpenAPI中的描述信息
// request指的是生成的request请求体映射信息
// target表示当前request指向那个Vue-Component内容，并最终去读取该组件的vaule
function getRequestMapping(prop: string, schema: ISchema, request: any, target: string) {
  if (schema.allOf?.length || schema.oneOf?.length) {
    const dataSchema = getObjectSchema(schema)
    if (dataSchema) {
      getRequestMapping(prop, dataSchema, request, target)
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
          for (const objR of objRequired) {
            required.push(`${r}.${objR}`)
          }
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
