import {Vue, Component, Prop} from 'vue-property-decorator';
import {sideMenu} from '../menu';
import * as api from '@/services/oneid';
import * as model from '@/models/oneid';

@Component({
  template: html`
  <div class="lg-noah-subadmin-add-page flex-col flex-auto" style="height: 0;">
    <div class="lg-noah-subadmin-add-page--scroll-wrapper flex-col flex-auto" style="height: 0">
      <div class="lg-noah-subadmin-add-page--header">
        <div class="back" @click="$router.back()">
          <Icon type="ios-arrow-back" size="18"></Icon>
          <span>返回</span>
        </div>
      </div>
      <div class="lg-noah-subadmin-add-page--middle flex-col flex-auto" style="height: 0">
        <div class="dept-settings flex-col">
          <div class="dept-settings-users flex-row">
            <span class="dept-settings-label">成员：</span>
            <Select
              v-model="form.usernameList"
              filterable
              multiple
              placeholder="选择员工"
              class="select-user"
            >
              <Option v-for="item in userOptions" :key="item.username" :value="item.username" :label="item.name" />
            </Select>
          </div>
          <div class="dept-settings-depts flex-row">
            <span class="dept-settings-label">管理范围：</span>
            <div class="flex-col">
              <RadioGroup vertical v-model="form.deptMode" class="radio-dept-mode">
                  <Radio label="tree">全公司</Radio>
                  <Radio label="self_tree">所在部门及下级部门</Radio>
                  <Radio label="node">特定部门</Radio>
              </RadioGroup>
              <Select
                v-if="form.deptMode === 'node'"
                v-model="form.deptIdList"
                filterable
                multiple
                placeholder="选择部门"
                class="select-dept"
              >
                <Option v-for="item in deptOptions" :key="item.id" :value="item.id" :label="item.name" />
              </Select>
            </div>
          </div>
        </div>
        <div class="perm-settings flex-col flex-auto" style="height: 0'">
          <div class="perm-settings-header flex-row">
            <div class="perm-settings-header-label flex-col">
              <span class="title">分配权限：</span>
              <span class="subtitle">将会在上面通讯录范围内配置权限</span>
            </div>
            <Checkbox v-model="form.isAllApp" @on-change="onIsAllAppChange"><span>全部权限</span></Checkbox>
          </div>
          <div class="perm-settings-main flex-row">
            <div class="perm-settings-main-basic-list">
              <span class="title">基础权限：</span>
              <ul v-if="basicPermOptions">
                <li v-for="item in basicPermOptions" :key="item.uuid">
                  <div class="logo">
                    <img :src="item.src || 'https://picsum.photos/100/100?random&t=1234'"/>
                  </div>
                  <span class="name">{{ item.name }}</span>
                  <Checkbox
                    v-model="item.checked"
                    class="checkbox"
                  />
                </li>
              </ul>
            </div>
            <div class="perm-settings-main-app-list">
              <span class="title">应用权限：</span>
              <CheckboxGroup v-model="form.appIdList" :indeterminate="true">
              <ul v-if="appPermOptions && role">
                <li v-for="item in appPermOptions" :key="item.uid">
                  <div class="logo">
                    <img :src="item.src || 'https://picsum.photos/100/100?random&t=1234'"/>
                  </div>
                  <span class="name">{{ item.name }}</span>
                  <Checkbox
                    :label="item.uid"
                    class="checkbox"
                    :disabled="form.isAllApp"
                  />
                </li>
              </ul>
              </CheckboxGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lg-noah-subadmin-add-page--footer">
      <Button type="primary" @click="doSave">保存并返回</Button>
    </div>
  </div>
  `,
})
export default class Edit extends Vue {
  role: model.Role|null = null;
  roleUserList: model.User[] = [];

  userOptions: model.User[] = [];
  deptOptions: model.Dept[] = [];
  basicPermOptions: any[]|null = null;
  appPermOptions: any[]|null = null;

  tmpAppIdList: string[] = [];
  form: {
    usernameList: string[];
    deptIdList: string[];
    deptMode: 'tree'|'self_tree'|'node'|null;
    appIdList: string[];
    isAllApp: boolean;
  } = {
    usernameList: [],
    deptIdList: [],
    deptMode: null,
    appIdList: [],
    isAllApp: false,
  };

  get viewMeta() {
    return {
      fixHeight: true,
      breadcrumb: ['设置', '设置子管理员'],
      sideMenu: {
        menus: sideMenu.menus,
        activeName: 'oneid.config.subadmin',
      },
    };
  }

  get isNew() {
    return this.$route.params.id === '0';
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    await this.loadRole();
    await this.loadRoleUsers();

    await this.loadForm();
    console.log(this.form);

    await this.loadUserOptions();
    await this.loadDeptOptions();
    await this.loadBasicPermOptions();
    await this.loadAppPermOptions();

  }

  async loadUserOptions() {
    const {results: userList} = await api.User.list();
    this.userOptions = userList;
  }
  async loadDeptOptions() {
    const {results: deptList} = await api.Dept.list();
    this.deptOptions = deptList;
  }
  async loadBasicPermOptions() {
    this.basicPermOptions = [];
  }
  async loadAppPermOptions() {
    const {results: appPermOptions} = await api.App.list();
    this.appPermOptions = appPermOptions;
  }

  async loadRole() {
    const {id} = this.$route.params;
    this.role = this.isNew ? model.Role.fromData() : await api.Role.retrieve(id);
  }

  async loadRoleUsers() {
    if (!this.isNew) {
      const {id} = this.$route.params;
      const {data: roleUserList} = await api.Role.user({query: {id}});
      this.roleUserList = roleUserList;
    }
  }

  async loadForm() {
    if (this.isNew) {
      return;
    }
    const {form} = this;
    form.appIdList = this.role!.managerGroup!.apps;
    form.deptIdList = this.role!.managerGroup!.depts;
    form.deptMode = this.role!.managerGroup!.dept_subject;
    form.isAllApp = this.role!.managerGroup!.all_apps;
    form.usernameList = this.roleUserList.map(user => user.username);
    this.form = {...form};
  }

  async doSave() {
    const isValid = this.validateForm();
    if (!isValid) {
      return;
    }

    const role = this.role!;
    role.parent = null;

    const depts = this.form.deptMode === 'tree' ? ['root']
      : this.form.deptMode === 'node' ? this.form.deptIdList
      : this.form.deptMode === 'self_tree' ? []
      : [];

    role.managerGroup = {
      depts,
      dept_subject: this.form.deptMode!,
      apps: this.form.appIdList,
      all_apps: this.form.isAllApp,
    };

    if (this.isNew) {
      const newRole = await api.Role.createSubAdmin(role);
      await api.Role.updateUsers(newRole.id, {userIds: this.form.usernameList});
    } else {
      await api.Role.update(role);
      await api.Role.updateUsers(role.id, {userIds: this.form.usernameList});
    }
    this.$router.back();
  }

  validateForm(): boolean {
    if (this.form.usernameList.length === 0) {
      this.$Message.error('请设置成员');
      return false;
    }
    if (!this.form.deptMode) {
      this.$Message.error('请设置管理范围');
      return false;
    }
    if (this.form.deptMode && this.form.deptMode === 'node' && this.form.deptIdList.length === 0) {
      this.$Message.error('请设置管理范围');
      return false;
    }
    if (this.form.appIdList.length === 0 && !this.form.isAllApp) {
      this.$Message.error('请设置应用权限');
      return false;
    }
    return true;
  }

  onIsAllAppChange(isAllApp: boolean) {
    if (isAllApp) {
      this.tmpAppIdList = this.form.appIdList;
      this.form.appIdList = this.appPermOptions!.map(o => o.uid);
    } else {
      this.form.appIdList = this.tmpAppIdList;
    }
  }
}
