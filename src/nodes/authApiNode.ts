import { APINode } from "arkfbp/lib/apiNode";

export class AuthApiNode extends APINode {
  headers = {
    Authorization: "token " + localStorage.getItem("userToken"),
  };
}
