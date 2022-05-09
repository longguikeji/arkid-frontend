import { IFNode } from 'arkfbp/lib/ifNode'
import { ConfigModule } from '@/store/modules/config'

export class UrlNode extends IFNode {
  condition() {
    const url = ConfigModule.origin
    return url !== ''
  }
}
