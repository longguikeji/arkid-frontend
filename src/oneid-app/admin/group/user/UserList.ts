import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import * as api from '@/services/oneid';
import EditUser from './EditUser';
import ChooseNode from '@/oneid-app/comps/choose/Choose';
import {Node, User} from '@/models/oneid';
import './UserList.less';

@Component({
  components: {
    EditUser,
    ChooseNode,
  },
  template: html`
  <div class="ui-user-list">
    <div class="ui-user-list-toolbar flex-row">
      <div class="flex-row flex-auto">
        <Button type="primary" @click="goAdd" v-if="table">添加账号</Button>
        <Button :disabled="tableSelection.length === 0" @click="doExport">批量导出</Button>
        <Upload name="users"
          v-bind="upload"
          :on-success="onUploadSuccess"
          :show-upload-list="false"
          class="upload"
        >
          <Button type="primary">批量导入/修改</Button>
        </Upload>
        
        <Button :disabled="tableSelection.length === 0" v-if="isGroupPage" @click="doMove">调整分组</Button>
        <Button :disabled="tableSelection.length === 0" v-if="isGroupPage" @click="removeFromNode">移出分组</Button>
        <Button :disabled="table && table.length === 0" v-if="isGroupPage">调整排序</Button>
        <Button v-if="table" :disabled="tableSelection.length === 0" @click="doRemove">批量删除</Button>
      </div>
      <Input
        v-if="!isGroupPage && table"
        v-model="keyword"
        @on-change="doSearch"
        search clearable placeholder="搜索"
        class="search"
      />
    </div>

    <div class="ui-user-list-table-wrapper flex-col">
      <Table
        v-if="table"
        :columns="columns"
        :data="table"
        class="table"
        @on-selection-change="onTableSelectionChange"
      />
    </div>
    <div class="page-wrapper flex-col">
      <Page
        v-if="table"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-size-opts="pagination.pageSizeOpts"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        show-total
        show-sizer
        class="page flex-row"
      />
    </div>

    <EditUser
      ref="editUser"
      v-if="editUser"
      v-bind="editUser"
      @on-save="onEditSave"
    />
    <ChooseNode
      ref="chooseNode"
      v-if="chooseNode"
      v-bind="chooseNode"
      @on-ok="onChooseNodeOk"
    />

  </div>
  `,
})
export default class UserList extends Vue {
  $refs!: {
    editUser: EditUser,
    chooseNode: ChooseNode,
  };

  @Prop({type: Node}) metaNode?: Node;
  @Prop({type: Node}) node?: Node;

  keyword = '';
  table: User[]|null = null;
  tableSelection: User[] = [];
  pagination = {
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizeOpts: [10, 20, 40, 60, 80, 100],
  };
  curInviteHref = '';

  editUser: {
    node?: Node,
    user?: User,
  }|null = null;

  chooseNode: any|null = null;

  get isGroupPage() {
    return this.$route.name!.startsWith('admin.group');
  }

  get columns() {
    return [
      {type: 'selection', width: 50, align: 'center'},
      // {title: 'ID', key: 'id', width: 100},
      {title: '登录账号', width: 200, render: this.renderUsernameCell},
      {title: '姓名', key: 'name', width: 140},
      {title: '手机号', key: 'mobile', width: 140},
      {title: '邮箱', key: 'email', width: 200},
      {title: '注册方式', key: '', width: 140},
      {title: '是否为子管理员', minWidth: 140, render: (h: Vue.CreateElement, {row: user}: {row: User}) => {
        return h('span', user.isManager ? '是' : '否');
      }},
      {title: '操作', width: 300, render: this.renderActionCell},
    ];
  }

  async loadData() {
    const {pagination, node, keyword} = this;
    const data = this.node
      ? await api.Node.user(node.id!)
      : await api.User.list({...pagination, keyword});
    this.table = data.results;
    this.pagination.total = data.count;

    this.$emit('ready');
  }

  doSearch(event: Event) {
    this.keyword = event.target!.value;
    this.loadData();
  }

  onPageChange(page: number) {
    this.pagination.page = page;
    this.loadData();
  }
  onPageSizeChange(pageSize: number) {
    if (pageSize === this.pagination.pageSize) {
      return;
    }
    this.pagination = {...this.pagination, pageSize};
    this.loadData();
  }

  goAdd() {
    this.editUser = null;
    this.$nextTick(() => {
      this.editUser = {node: this.node};
      this.$nextTick(() => this.$refs.editUser.show());
    });
  }

  async goEdit(user: User) {
    // retrieve API 返回的数据才包含属性: '所属部门', '角色'
    const fulluser = await api.User.retrieve(user.username);

    this.editUser = null;
    this.$nextTick(() => {
      this.editUser = {user: fulluser};
      this.$nextTick(() => this.$refs.editUser.show());
    });
  }

  onEditSave() {
    this.loadData();
  }

  async goInvite(user: User) {
    this.$Loading.start();
    try {
      const data = await api.UCenter.invite(user.username);
      const invitePage = this.$router.resolve({
        name: 'oneid.signup',
        query: {key: data.key},
      });
      this.curInviteHref = window.location.origin + window.location.pathname + invitePage.href;
      this.$Message.info({
        content: '邀请链接已经复制到剪贴板，快去邀请ta激活账号吧！',
        duration: 4
      });

      await this.$copyText(this.curInviteHref);
      this.$Loading.finish();
    } catch (e) {
      this.$Loading.error();
      console.log(e);
    }
  }

  renderUsernameCell(h: Vue.CreateElement, {row: user}: {row: User}) {
    const username = h('span', user.username);
    const settled = h('span', {class: 'ui-user-is-settled'}, '已激活');
    return user.is_settled ? [username, settled] : [username];
  }

  renderActionCell(h: Vue.CreateElement, {row: user}: {row: User}) {
    return h(ActionCell, {
      props: {
        user: user,
      },
      on: {
        'on-edit': () => this.goEdit(user),
        'on-edit-perm': () => this.$router.replace({
          name: 'admin.account.perm',
          query: {username: user.username},
        }),
        'on-activate': () => this.goInvite(user),
      }
    });
  }

  onTableSelectionChange(selection: User[]) {
    this.tableSelection = selection;
  }

  doRemove() {
    this.$Modal.confirm({
      title: '确认要删除选中的成员',
      onOk: this.remove,
    });
  }

  async doExport() {
    console.log('doExport');
    const usernames = this.tableSelection.map(user => user.username);
    const data = await api.User.export(usernames);
    let blob = new Blob([data], {
        type: 'text/csv',
      });
      let filename = 'users.csv';
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank');
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
      }
  }

  onUploadSuccess(resp: {file_name: string}) {
    this.$Message.success('导入成功');
  }

  get upload() {
    return {
      headers: api.File.headers(),
      action: api.User.getImportUsersURL(),
      data: this.node && {node_uid: this.node.id},
    };
  }

  async remove() {
    this.$Loading.start();
    try {
      // TODO (kaishun): 改用批量删除接口
      await Promise.all(this.tableSelection.map(user => api.User.remove(user)));
      this.$Loading.finish();
      this.$emit('on-update');
      this.loadData();
    } catch (e) {
      console.log(e);
      this.$Loading.error();
    }
  }

  async removeFromNode() {
    this.$Loading.start();
    try {
      await api.Node.removeUsers(this.node!.id, this.tableSelection);
      this.$Loading.finish();
      this.$emit('on-update');
      this.loadData();
    } catch (e) {
      console.log(e);
      this.$Loading.error();
    }
  }

  doMove() {
    this.chooseNode = {
      metaNode: this.metaNode,
      title: '选择部门',
      multiple: true,
    };
    this.$nextTick(() => this.$refs.chooseNode.show());
  }

  async onChooseNodeOk(nodes: Node[]) {
    this.$Loading.start();
    try {
      await api.Node.moveUsers(this.node!.id, this.tableSelection, nodes);
      this.$Loading.finish();
      this.$emit('on-update');
      this.loadData();
    } catch (e) {
      console.log(e);
      this.$Loading.error();
    }
  }

  mounted() {
    this.loadData();
  }
}


@Component({
  template: html`
  <div>
    <span class="table-btn" @click="$emit('on-edit')">编辑账号</span>
    <span class="table-btn" @click="$emit('on-edit-perm')">应用内权限</span>
    <span v-if="!user.is_settled" class="table-btn" @click="$emit('on-activate')">邀请激活</span>
  </div>
  `,
})
class ActionCell extends Vue {
  @Prop({type: Object, required: true}) user!: User;
}
