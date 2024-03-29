import OpenAPI, { ISchema } from '@/config/openapi'

export function getSchemaByContent(content: { [requestBodyType: string]: {schema:ISchema}}):ISchema {
  let type = ''
  for (type in content) { // 任意获取一个key
    break
  }
  let schema = content[type] && content[type].schema
  if (!schema) return {}
  if (schema.$ref) {
    schema = OpenAPI.instance.getSchemaByRef(schema.$ref)
    const properties = schema && schema.properties
    if (properties) {
      const items = properties.results?.items || properties.data?.items || properties.items?.items
      if (items && (items as ISchema).$ref) {
        const ref = (items as ISchema).$ref
        if (ref) schema = OpenAPI.instance.getSchemaByRef(ref)
      }
    }
  }
  if (schema.items) {
    const itemsSchema = schema.items as ISchema
    if (itemsSchema && itemsSchema.$ref) {
      schema = OpenAPI.instance.getSchemaByRef(itemsSchema.$ref)
    }
  }
  return schema
}


export function getSchemaByPath(path: string, method: string): ISchema {
  const content = getContent(path, method)
  const schema = getSchemaByContent(content)
  return schema
}

export function getContent(path: string, method: string) {
  const operation = OpenAPI.instance.getOperation(path, method)
  if (!operation) {
    return {}
  } else {
    const responseOrRequest = method.toLowerCase() === 'get' ? true : false
    const content = responseOrRequest ? operation.responses[200].content : operation.requestBody.content
    return content
  }
}

export function getParamsByPath(path: string, method: string) {
  const operation = OpenAPI.instance.getOperation(path, method)
  return operation ? operation.parameters : null
}
