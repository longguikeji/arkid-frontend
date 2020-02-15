import {Vue, Component, Prop} from 'vue-property-decorator';
import {sideMenu} from '../menu';
import * as api from '@/services/oneid';
import * as model from '@/models/oneid';

@Component({
  template: html`
  <div class="lg-noah-subadmin-page">
    <div class="lg-noah-subadmin-page--header">
      <RouterLink :to="{name: 'oneid.config.subadmin.edit', params: {id: '0'}}">
        <Button>添加新的子管理员</Button>
      </RouterLink>
    </div>
    <div class="lg-noah-subadmin-page--table">
      <Table
        v-if="adminList"
        :columns="columns"
        :data="adminList"
      ></Table>
    </div>
  </div>
  `,
})
export default class SubAdmin extends Vue {
  adminList: any[]|null = null;

  get viewMeta() {
    return {
      breadcrumb: [
        {label: '设置', path: {name: 'oneid.config'}},
        '设置子管理员',
      ],
      sideMenu: {
        menus: sideMenu.menus,
        activeName: 'oneid.config.subadmin',
      },
    };
  }

  get columns() {
    return [
      {
        title: '成员',
        render: (h, {row}) => {
          const names = row.users.map(user => user.name).join(', ');
          return h('span', names);
        },
      },
      {
        title: '管理范围',
        render: (h, {row}) => {
          if (row.deptMode === 'node') {
            const items = row.depts.map(dept => h('li', [
              h('i', {class: 'icon-dept'}),
              dept.name,
            ]));
            return h('ul', {class: 'grid-dept'}, items);
          }
          if (row.deptMode === 'tree') {
            return h('span', '全部');
          }
          if (row.deptMode === 'self_tree') {
            return h('span', '所在部门及以下部门');
          }
        },
      },
      {
        title: '权限',
        render: (h, {row}) => {
          const items = row.apps.map(app => h('li', app.name));
          return h('ul', {class: 'grid-perm'}, items);
        },
      },
      {
        title: '操作',
        align: 'center',
        render: (h, {row}) => {
          const editBtn =  h('Button', {
            style: {
              width: '74px',
              marginRight: '26px',
            },
            on: {
              click: () => {
                this.$router.push({
                  name: 'oneid.config.subadmin.edit',
                  params: {id: row.id},
                });
              },
            },
          }, '编辑');
          const deleteBtn =  h('Button', {
            style: {
              width: '74px',
            },
            on: {
              click: () => {
                this.$Modal.confirm({
                  render: () => '删除该子管理员配置',
                  onOk: () => this.remove(row),
                });
              },
            },
          }, '删除');
          return [editBtn, deleteBtn];
        },
      },
    ];
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    const adminList = await api.Role.subAdminList();
    const {results: appList} = await api.App.list(await this.$app.org());
    const {results: deptList} = await api.Dept.list();

    this.adminList = adminList.map(({role, users}) => ({
      id: role.id,
      apps: appList.filter(app => role.managerGroup!.apps.indexOf(app.uid) !== -1),
      depts: deptList.filter(dept => role.managerGroup!.depts.indexOf(dept.id) !== -1),
      deptMode: role.managerGroup!.dept_subject,
      users,
    }));
  }

  async remove(role: model.Role) {
    this.$Loading.start();
    try {
      await api.Role.removeSubAdmin(role);
      this.adminList = this.adminList!.filter(item => item.id !== role.id);
      this.$Loading.finish();
    } catch (e) {
      this.$Loading.error();
    }
  }
}
