import { ExportXlsxFileNode } from '@/nodes/exportXlsxFileNode'
import getUrl from '@/utils/url'
export class Export extends ExportXlsxFileNode {

  async run() {
    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method
    await super.run()
  }
}
