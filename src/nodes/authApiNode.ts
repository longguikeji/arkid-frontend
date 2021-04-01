import { APINode } from "arkfbp/lib/apiNode";
import getNodeState from '@/utils/get-node-state'

export class AuthApiNode extends APINode {
  headers = {
    Authorization: "token " + localStorage.getItem("token"),
  };

  getState(path: string = '') {
    return getNodeState(path)
  }
}
