// 完成 request 和 response 两者的数据映射关系
// 说明：先进行分批次分类型分组件的完成，之后可以进行统一化处理
import OpenAPI from '@/config/openapi'

export function getFormPageDialogStateMapping(url: string, method: string, target: string) {
  const requestMapping = {}
  const responseMapping = {}
  const isResponses = method.toUpperCase() === 'GET' ? true : false
  const operation = OpenAPI.instance.getOperation(url, method)
  const content = isResponses ? operation.responses[200].content : operation.requestBody.content
  const ref = content[Object.keys(content)[0]].schema.$ref as string
  const schema = OpenAPI.instance.getSchemaByRef(ref)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    responseMapping[ target + '.select.value'] = propertyName
    requestMapping[propertyName] = target + '.select.value'
    for (const refValue in schema.discriminator.mapping) {
      const refSchema = OpenAPI.instance.getSchemaByRef(schema.discriminator.mapping[refValue])
      const props = refSchema.properties
      for (const prop in props) {
        if (props[prop].oneOf?.length || props[prop].allOf?.length) {
          const itemsOf = props[prop].oneOf || props[prop].allOf
          const itemsRef = itemsOf![0].$ref as string
          const itemsSchema = OpenAPI.instance.getSchemaByRef(itemsRef)
          const itemsProps = itemsSchema.properties
          requestMapping[prop] = {}
          for (const itemProp in itemsProps) {
            const itemValueMapping = target + '.forms[' + propertyName + '].items.' + prop + '.state.items.' + itemProp + '.state.value' 
            responseMapping[itemValueMapping] = 'data.' + itemProp
            requestMapping[prop][itemProp] = itemValueMapping
          }
        } else if (prop !== propertyName) {
          const valueMapping = target + '.forms[' + propertyName + '].items.' + prop + '.state.value'
          responseMapping[valueMapping] = prop
          requestMapping[prop] = valueMapping
        }
      }
    }
  } else {
    const props = schema.properties
    for (const prop in props) {
      const valueMapping = target + '.form.items.' + prop + '.state.value'
      responseMapping[valueMapping] = prop
      requestMapping[prop] = valueMapping
    }
  }
  return {
    requestMapping, responseMapping
  }
}