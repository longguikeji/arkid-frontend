import { APINode } from "arkfbp/lib/apiNode";

export class LoginNode extends APINode {
  mode = "direct";
  url = "/api/arkid/login/";
  method = "post";
  async buildParams() {
    const username = this.inputs.username;
    const password = this.inputs.password;
    return { username: username, password: password };
  }
}
