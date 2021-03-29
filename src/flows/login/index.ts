import { Flow } from "arkfbp/lib/flow";
import { Graph } from "arkfbp/lib/graph";
import { StartNode } from "arkfbp/lib/startNode";
import { StopNode } from "arkfbp/lib/stopNode";
import { LoginNode } from "./nodes/LoginNode";
export class LoginFlow extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: "start",
        next: "1",
      },
      {
        cls: LoginNode,
        id: "1",
        positiveNext: "2",
        negativeNext: "3",
      },
      {
        cls: StopNode,
        id: "3",
      },
    ];
  }

  createGraph() {
    const g = new Graph();
    g.nodes = this.createNodes();
    return g;
  }
}
