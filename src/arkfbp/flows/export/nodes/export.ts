import { CsvNode } from '@/arkfbp/nodes/csvNode'

export class Export extends CsvNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    await super.run()
  }
}
