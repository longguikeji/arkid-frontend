import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI, { ISpec, IOpenAPIRouter, ITagPage } from '@/config/openapi'

export default function getApiRoles(page: string) {
  const pageTagInfo = OpenAPI.instance.getOnePageTagInfo(page)
  
}
