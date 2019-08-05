import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {User} from '@/models/oneid';
import * as api from '@/services/oneid';
import './UserList.less';

@Component({
  template: html`
  <div class="ui-choose-userlist">
    <Input
      v-model="userKeyword"
      search
      clearable
      placeholder="搜索"
      on-change="onUserKeywordChange"
    />
    <ul class="user-list">
      <li v-for="item in displayUserList">
        <span class="user-name">{{ item.name }}</span>
        <Checkbox
          @on-change="val => onUserCheckChange(item, val)"
          :value="item.checked"
        ></Checkbox>
      </li>
    </ul>
  </div>
  `,
})
export default class UserList extends Vue {
  @Prop({type: Array, default: () => []}) userSelection!: User[];

  userKeyword: string = '';
  userList: User[] = [];
  displayUserList: User[] = [];

  @Watch('userList', {deep: true, immediate: true})
  onUserListChange() {
    this.getDisplayUserList();
  }

  @Watch('userSelection', {deep: true, immediate: true})
  onUserSelectionChange() {
    this.getDisplayUserList();
  }

  getDisplayUserList() {
    const {userList} = this;
    const ids = this.userSelection.map(user => user.id);
    userList.forEach((user: User) => {
      user.checked = ids.includes(user.id);
    });
    this.displayUserList = [...userList];
  }

  async loadUser() {
    const {userKeyword: keyword} = this;
    const {results} = await api.User.list({keyword});
    this.userList = results;
  }

  onUserCheckChange(user: User, val: boolean) {
    user.checked = val;

    this.$emit(
      'on-check-change',
      this.userList.filter(u => u.checked),
      user,
    );
  }

  onUserKeywordChange() {
    this.loadUser();
  }

  async mounted() {
    await this.loadUser();
  }
}
