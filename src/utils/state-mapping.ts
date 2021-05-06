// 完成 request 和 response 两者的数据映射关系
// 说明：先进行分批次分类型分组件的完成，之后可以进行统一化处理
import OpenAPI from '@/config/openapi'

export function getFormPageDialogStateMapping(url: string, method: string, target: string, isEmpty?: boolean, isIncludeReadOnly?: boolean) {
  const requestMapping = {}
  const responseMapping = {}
  const isResponses = method.toUpperCase() === 'GET' ? true : false
  const operation = OpenAPI.instance.getOperation(url, method)
  const content = isResponses ? operation.responses[200].content : operation.requestBody.content
  const ref = content[Object.keys(content)[0]].schema.$ref as string
  const schema = OpenAPI.instance.getSchemaByRef(ref)
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectValueMapping = target + '.select.value'
    if (!isEmpty) {
      responseMapping[selectValueMapping] = {
        value: propertyName
      }
    } else {
      responseMapping[selectValueMapping] = ''
    }
    const response = responseMapping[selectValueMapping]
    requestMapping[propertyName] = {
      value: selectValueMapping
    }
    const request = requestMapping[propertyName]
    if (!isEmpty) {
      for (const refValue in schema.discriminator.mapping) {
        response[refValue] = {}
        request[refValue] = {}
        const refSchema = OpenAPI.instance.getSchemaByRef(schema.discriminator.mapping[refValue])
        const props = refSchema.properties
        for (const prop in props) {
          if (props[prop].oneOf?.length || props[prop].allOf?.length) {
            const itemsOf = props[prop].oneOf || props[prop].allOf
            const itemsRef = itemsOf![0].$ref as string
            const itemsSchema = OpenAPI.instance.getSchemaByRef(itemsRef)
            const itemsProps = itemsSchema.properties
            request[refValue][prop] = {}
            for (const itemProp in itemsProps) {
              const responseItemValueMapping = target + '.forms[' + propertyName + '].items.' + prop + '.state.items.' + itemProp + '.state.value' 
              const requestItemValueMapping = target + '.forms[' + selectValueMapping + '].items.' + prop + '.state.items.' + itemProp + '.state.value' 
              response[refValue][responseItemValueMapping] = 'data.' + itemProp
              request[refValue][prop][itemProp] = requestItemValueMapping
            }
          } else if (prop !== propertyName) {
            const responseValueMapping = target + '.forms[' + propertyName + '].items.' + prop + '.state.value'
            const requestValueMapping = target + '.forms[' + selectValueMapping + '].items.' + prop + '.state.value'
            response[refValue][responseValueMapping] = prop
            request[refValue][prop] = requestValueMapping
          }
        }
      }
    }
  } else {
    const formItemsProps = schema.properties
    for (const formItemProp in formItemsProps) {
      const valueMappingSuffix = 'form.items.' + formItemProp + '.state.value'
      const valueMapping = (target === '' ? valueMappingSuffix : target + '.' + valueMappingSuffix)
      responseMapping[valueMapping] = isEmpty ? '' : formItemProp
      requestMapping[formItemProp] = valueMapping
    }
  }
  return {
    requestMapping, responseMapping
  }
}