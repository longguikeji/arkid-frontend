import {Component, Prop} from 'vue-property-decorator';
import Base from './Choose';
import * as api from '@/services/oneid';
import * as model from '@/models/oneid';

@Component
export default class ChooseUser extends Base {
  @Prop(String) roleId!: number;

  type: 'node'|'user' = 'user';
  disableDeptCheckbox = true;

  async setCheckedIds() {
    const {roleId: id} = this;
    const {data: users} = await api.Role.user({query: {id}});
    this.checkedIds = users.map((i: model.User) => i.id);
  }

  async onOk() {
    const id = this.roleId;
    const userIds = this.userSelection.map(i => i.raw.username);

    this.$Loading.start();
    try {
      await api.Role.updateUsers(id, {userIds});
      this.$Loading.finish();
      this.$emit('on-save');
    } catch (e) {
      this.$Loading.error();
      this.$emit('on-save');
    }
  }
}
