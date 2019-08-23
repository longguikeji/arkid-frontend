import {Vue, Component, Prop} from 'vue-property-decorator';
import {File as FileApi} from '@/services/oneid';
import './SiteLogo.less';

@Component({
  template: html`
<div class="ui-site-logo flex-row">
  <img class="logo" :src="siteLogo"/>
  <span class="org-name">{{ siteName }}</span>
</div>
  `,
})
export default class SiteLogo extends Vue {
  @Prop({type: String}) logo?: string;
  @Prop({type: String}) name?: string;

  @Prop({default: false}) customLogoFirst!: boolean;

  get siteLogo() {
    if (this.logo) {
      return this.logo;
    }
    const icon = this.$app.metaInfo!.org.icon;
    return (this.customLogoFirst && icon) ? FileApi.url(icon) : require('@/assets/oneid-logo.svg');
  }

  get siteName() {
    return this.name || this.$app.metaInfo!.org.nameCn;
  }
}
