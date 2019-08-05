import {Vue, Component, Prop} from 'vue-property-decorator';
import './SimpleFrame.less';

import * as api from '@/services/oneid';


@Component({
  template: html`
<div class="ui-s-frame">
  <div class="ui-s-frame--org-info">
      <SiteLogo :customLogoFirst="true" />
  </div>
  <slot />
</div>
  `,
})
export default class SimpleFrame extends Vue {

}
