import {Vue, Component} from 'vue-property-decorator';
import UserList from '../group/user/UserList';
import './Account.less';

@Component({
  components: {
    UserList,
  },
  template: html`
  <div class="ui-account-page">
    <div v-if="loading" style="margin: auto; display: flex;">
      <Spin large></Spin>
    </div>
    <div class="ui-account-page-wrapper" v-show="!loading">
      <UserList @ready="loading = false" />
    </div>
  </div>
  `,
})
export default class Account extends Vue {
  loading = true;

  get viewMeta() {
    return {
      breadcrumb: ['账号管理', '所有账号'],
    };
  }
}
