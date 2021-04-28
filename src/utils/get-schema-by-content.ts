import OpenAPI, { ISchema } from '@/config/openapi'

export default function getSchemaByContent(content: { [requestBodyType: string]: {schema:ISchema}}):ISchema {
  let type = ''
  for (type in content) { // 任意获取一个key
    break
  }
  let schema = content[type].schema
  if (schema.$ref) {
    schema = OpenAPI.instance.getSchemaByRef(schema.$ref)
    if (schema?.properties) {
      const properties = schema.properties
      if (properties.results?.items || properties.data?.items) {
        const items = properties.results?.items || properties.data?.items
        if ((items as ISchema).$ref) {
          const ref = (items as ISchema).$ref
          if (ref) schema = OpenAPI.instance.getSchemaByRef(ref)
        }
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
