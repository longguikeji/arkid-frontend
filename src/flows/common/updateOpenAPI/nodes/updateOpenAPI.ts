import { APINode } from '@/arkfbp/nodes/apiNode'
import OpenAPI from '@/config/openapi'

export class UpdateOpenAPI extends APINode {
  async run() {
    await OpenAPI.instance.init('/api/schema?format=json')
  }
}