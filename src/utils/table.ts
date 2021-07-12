import  OpenAPI, { ISchema } from '@/config/openapi'

export function getFetchAttrs(content: { [contentType: string]: {schema: ISchema} } | undefined): FetchTableAttrs {
  if (!content) return {}
  const type = Object.keys(content)[0]
  const responseSchema = content[type].schema
  let ref = responseSchema.$ref as string
  if (responseSchema.items) { ref = (responseSchema.items as ISchema).$ref as string }
  const responseData = OpenAPI.instance.getSchemaByRef(ref)
  const fetchTableAttrs: FetchTableAttrs = {
    data: '',
    pagination: false
  }
  if (responseData?.properties) {
    const props = responseData.properties
    fetchTableAttrs.pagination = props.count ? 'count' : false
    fetchTableAttrs.data = props.results ? 'results' : props.data ? 'data' : ''
  }
  return fetchTableAttrs
}

interface FetchTableAttrs {
  data?: string
  pagination?: boolean | string
}