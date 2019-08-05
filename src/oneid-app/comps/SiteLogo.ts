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
  @Prop({default: false}) customLogoFirst!: boolean;

  get siteLogo() {
    const icon = this.$app.metaInfo!.org.icon;
    return (this.customLogoFirst && icon) ? FileApi.url(icon) : require('@/assets/oneid-logo.svg');
  }

  get siteName() {
    return this.$app.metaInfo!.org.nameCn;
  }
}
