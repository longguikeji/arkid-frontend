import {Config as ConfigApi} from '@/services/config'
import { Component, Prop, Vue } from 'vue-property-decorator'
import './ContactsSwitch.less'

@Component({
  template: html`
  <div class="ui-contacts-config flex-col flex-auto">
    <div class="main">
      <h2 class="subtitle">通讯录开关设置</h2>
      <div>
        <span>通讯录开关：</span>
        <SwitchButton v-model="status" @on-change="change" size="large">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </SwitchButton>
      </div>
    </div>
  </div>
  `,
})
export default class ContactsSwitch extends Vue {
  private status: boolean = false

  mounted() {
    this.getConfig()
  }

  // get contacts-switch config
  async getConfig() {
    // ...
  }

  // save contacts-switch config
  async change(value: boolean) {
    this.status = value
    await this.saveConfig()
  }

  // save contacts-switch config
  async saveConfig() {
    // ...
  }

}