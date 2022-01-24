import { Flow } from "arkfbp/lib/flow";
import { Graph } from "arkfbp/lib/graph";
import { StartNode } from "arkfbp/lib/startNode";
import { StopNode } from "arkfbp/lib/stopNode";
import { UrlNode } from "@/arkfbp/nodes/urlNode";
import { SelectAccountNode } from "./nodes/select";

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: "start",
        next: "url"
      },
      {
        cls: UrlNode,
        id: "url",
        next: "app-select-account"
      },
      {
        cls: SelectAccountNode,
        id: "app-select-account",
        next: "stop"
      },
      {
        cls: StopNode,
        id: "stop"
      }
    ];
  }

  createGraph() {
    const g = new Graph();
    g.nodes = this.createNodes();
    return g;
  }
}
