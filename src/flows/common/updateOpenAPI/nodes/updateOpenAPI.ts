import { AuthApiNode } from "@/arkfbp/nodes/authApiNode"
import OpenAPI from '@/config/openapi'

export class UpdateOpenAPI extends AuthApiNode {
  async run() {
    await OpenAPI.instance.init('/api/schema?format=json')
  }
}