import { ExportXlsxFileNode } from '@/nodes/exportXlsxFileNode'
export class Export extends ExportXlsxFileNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    await super.run()
  }
}
