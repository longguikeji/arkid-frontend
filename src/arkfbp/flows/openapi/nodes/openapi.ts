import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'

export class OpenapiNode extends FunctionNode {

  async run() {
    await OpenAPI.instance.init('/api/schema?format=json')
  }

}
