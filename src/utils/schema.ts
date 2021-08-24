import OpenAPI, { ISchema } from '@/config/openapi'
import { FormItemsState } from '@/admin/common/Form/FormState'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'

export function getSchemaByContent(content: { [requestBodyType: string]: {schema:ISchema}}):ISchema {
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


export function getSchemaByPath(path: string, method: string): ISchema {
  const content = getContent(path, method)
  const schema = getSchemaByContent(content)
  return schema
}

export function getContent(path: string, method: string) {
  const operation = OpenAPI.instance.getOperation(path, method)
  if (!operation) { throw new Error('not exist operation in OpenAPI') }
  const responseOrRequest = method.toLowerCase() === 'get' ? true : false
  const content = responseOrRequest ? operation.responses[200].content : operation.requestBody.content
  return content
}

export function getApiRoles(path: string, method: string): string[] {
  const operation = OpenAPI.instance.getOperation(path, method)
  if (operation.roles) {
    return operation.roles
  }
  return []
}

export function isImportInputList(items: FormItemsState, inputListItems: FormItemState[]){
  Object.keys(items).forEach((key, index) => {
    const item = items[key]
    if (item.type === 'FormObjectItem') {
      isImportInputList(item.state.items, inputListItems)
    } else if (item.type === 'InputList') {
      inputListItems.push(item)
    }
  })
}
