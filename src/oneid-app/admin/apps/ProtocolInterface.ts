import { Vue, Component } from 'vue-property-decorator';
import {App} from '@/models/oneid';
import './ProtocolInterface.less';


@Component({
  template: html`
  <div>
    <Modal
      v-model="showProtocolInterface"
      fullscreen
      :closable="false"
      class="ui-admin-apps-protocol flex-auto flex-col"
    >
      <div slot="header" class="header flex-row">
        <div class="header-title">
          <h2 >协议接口详情</h2>
        </div>
      </div>
      <div class="body">
        <Form class="form" :label-width="300" :model="app">
          <h2 class="subtitle">协议配置</h2>
          <Tabs :animated="false" class="protocol-tab" type="card" v-if="app.auth_protocols.length != 0">
            <TabPane v-if="app.oauth_app" :label="authTypes[0]" :name="authTypes[0]">
              <FormItem label="client_id:">
                <p>{{ app.oauth_app.client_id }}</p>
              </FormItem>
              <FormItem label="client_secret:">
                <p class="client-secret">{{ app.oauth_app.client_secret }}</p>
              </FormItem>
              <FormItem label="client_type:">
                <p>{{ app.oauth_app.client_type }}</p>
              </FormItem>
              <FormItem label="authorization_grant_type:">
                <p>{{ app.oauth_app.authorization_grant_type }}</p>
              </FormItem>
              <FormItem label="redirect_uris:">
                <p>{{ app.oauth_app.redirect_uris }}</p>
              </FormItem>
              <FormItem v-for="item in app.oauth_app.more_detail" :label="item.name">
                <p>{{ item.value }}</p>
              </FormItem>
            </TabPane>
            <TabPane v-if="app.ldap_app" :label="authTypes[1]" :name="authTypes[1]">
              <FormItem v-for="item in app.ldap_app.more_detail" :label="item.name">
                <p>{{ item.value }}</p>
              </FormItem>
            </TabPane>
            <TabPane v-if="app.http_app" :label="authTypes[2]" :name="authTypes[2]">
              <FormItem v-for="item in app.http_app.more_detail" :label="item.name">
                <p>{{ item.value }}</p>
              </FormItem>
            </TabPane>
          </Tabs>
          
        </Form>
      </div>
      <div slot="footer" class="footer flex-row">
        <div class="buttons flex-row">
          <div></div>
          <div class="buttons-right">
            <Button type="primary" @click="quit">确定</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
  `,
})

export default class ProtocolInterface extends Vue {
  showProtocolInterface: boolean = false;
  app?: App | null = null;

  authTypes = ['OAuth 2.0', 'LDAP', 'HTTP'];

  showModal(app: App) {
    this.app = app;
    this.showProtocolInterface = true;
  }

  async quit() {
    this.showProtocolInterface = false;
  }

}