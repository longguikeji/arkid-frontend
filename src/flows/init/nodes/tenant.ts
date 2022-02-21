import { APINode } from "@/arkfbp/nodes/apiNode";
import { TenantModule } from "@/store/modules/tenant";
import { getSlug, getUrlParamByName, isIPAddress } from "@/utils/url";
import { ConfigModule } from "@/store/modules/config";
import { updateTitle, updateIcon } from "@/utils";

export class TenantNode extends APINode {
  async run() {
    // current tenant uuid and tenant switch info
    let uuid = "";

    // get method
    this.method = "get";

    // get platform uuid and tenant switch info
    this.url = "/api/v1/tenant_switchinfo/";
    const outputs = await super.run();
    if (outputs) {
      uuid = outputs.platform_tenant_uuid;
      TenantModule.setTenantSwitch(outputs.switch);
    }

    // get current slug
    const slug = getSlug();
    if (slug === "" || isIPAddress()) {
      uuid =
        getUrlParamByName("tenant") || getUrlParamByName("tenant_uuid") || uuid;
      if (uuid) {
        uuid = uuid.replace(/-/g, "");
        this.url = `/api/v1/tenant/${uuid}/`;
        const res = await super.run();
        if (res?.uuid) {
          TenantModule.setTenantIsPlatform(res.uuid === uuid);
          TenantModule.changeCurrentTenant(res);
        } else {
          TenantModule.changeCurrentTenant({ uuid });
        }
      }
    } else {
      this.url = `/api/v1/tenant/${slug}/slug/`;
      const data = await super.run();
      if (data?.uuid) {
        TenantModule.setTenantIsPlatform(data.uuid === uuid);
        ConfigModule.setSlug(slug);
        TenantModule.changeCurrentTenant(data);
      } else {
        TenantModule.changeCurrentTenant({ uuid });
      }
    }

    const { name, icon } = TenantModule.currentTenant;
    if (name) {
      updateTitle(name);
    }
    updateIcon(icon);
  }
}
