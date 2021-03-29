import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { Start } from './nodes/Start'
import { StopNode } from 'arkfbp/lib/stopNode'
import { GoPage } from './nodes/GoPage'
import { Redirect } from './nodes/Redirect'
import { Http } from './nodes/Http'
import { HttpResponse } from './nodes/HttpResponse'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: Start,
        id: 'start',
        next: 'gopage'
      },
      {
        cls: GoPage,
        id: 'gopage',
        next: 'redirect'
      },
      {
        cls: Redirect,
        id: 'redirect',
        next: 'http'
      },
      {
        cls: Http,
        id: 'http',
        next: 'response'
      },
      {
        cls: HttpResponse,
        id: 'response',
        next: 'stop'
      },
      {
        cls: StopNode,
        id: 'stop'
      }
    ]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}
