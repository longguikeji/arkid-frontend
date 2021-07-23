import { Config as ConfigApi } from '@/services/config'
import { Component, Vue } from 'vue-property-decorator'
import './ContactsSwitch.less'

@Component({
  template: html`
  <div class="ui-contacts-config flex-col flex-auto">
    <div class="main">
      <h2 class="subtitle">通讯录开关设置</h2>
      <div>
        <span>通讯录开关：</span>
        <SwitchButton v-model="show" @on-change="change" size="large">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </SwitchButton>
      </div>
    </div>
  </div>
  `,
})
export default class ContactsSwitch extends Vue {
  private show: boolean = false

  async mounted() {
    this.show = (this.$app.metaInfo && this.$app.metaInfo.contacts.show) || false
  }

  async change(value: boolean) {
    this.show = value
    await ConfigApi.updateContactsSwitch(this.show)
  }
}